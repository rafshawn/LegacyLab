---
tags:
  - Homelab
  - RaspberryPi
created: 2026-01-13
updated: 2026-01-13
categories:
  - Homelab
---
Logs are great for debugging and all, but they can also cause a lot of bloat that eventually becomes a strain for the system. Small write operations in high volume is the biggest culprit of causing the SD card on a Pi to wear and fail (see article).
# Docker Logging Drivers
- See [Configure default logging driver](https://docs.docker.com/engine/install/linux-postinstall/#configure-default-logging-driver)
- Docker's default method of logging is by using a `json-file` that essentially writes logs until there's no more storage space.
	- As logs increase in size, so does risk of exhausting disk resources and failing storage (wear).
	- See [JSON File logging driver](https://docs.docker.com/engine/logging/drivers/json-file/)
- Avoid issues with overusing disk for log data by enabling log rotation in `daemon.json`
	- See [Docker daemon config file](https://docs.docker.com/reference/cli/dockerd/#daemon-configuration-file)

For me, my setup is to have a max of 3 log files of max 5MB per container. So assume I have 10 containers, that's (at worst) 150MB of logs.

*But won't this mean read/write operations happen more often and deteriorate the SD card more?* That's where Wear Levelling exists.
- Essentially, SD cards generally use Wear Levelling algorithms to spread writes across available cells.
- The less free storage exists --> the less free "empty" cells to write on --> the more existing empty cells suffer wear
- i.e., if you have 6 buckets and you fill 3 up with marbles, you have 3 empty ones to use to move the marbles around.
	- If you only have one bucket free, you'd be forced to reuse it for pretty much every operation.
	- Let's just say that the more this bucket is used, the more likely you're gonna break it.
- [This person describes it in more technical detail](https://electronics.stackexchange.com/a/764029).
- Also see [Sandisk's paper on Wear Levelling](https://web.archive.org/web/20150326122100/http://ugweb.cs.ualberta.ca/%7Ec274/resources/hardware/SDcards/WPaperWearLevelv1.0.pdf).

Anyway... Here's how I configured my `daemon.json` file:
1. Run the command
```zsh
sudo nano /etc/docker/daemon.json
```

2. Paste this into the JSON file
```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "5m",
    "max-file": "3",
    "compress": "true"
  }
}
```

3. Restart docker
```zsh
sudo systemctl restart docker
```
# Log2RAM
- Best to keep Log2RAM size small on a Pi 2B with 1GB RAM. 
- Something like 40-60MB so the containers have enough memory.
- Drawbacks of an SD card is that it has limited lifespan.
- Reduce load by moving log files to RAM.
- Only affects logs written to /var/log and wont have any effects on Docker logs or logs inside containers.

## Installation

### Via APT on Debian 13 (Trixie)
At the time of writing this, the instructions on Log2RAM's github (for installing via Debian's APT) may be different. I recommend instead installing manually.

See the following issues for more details on this:
- https://github.com/azlux/log2ram/issues/259
- https://github.com/azlux/log2ram/pull/263/files?short_path=b335630#diff-b335630551682c19a781afebcf4d07bf978fb1f8ac04c6bf87428ed5106870f5

```zsh
. /etc/os-release
sudo wget -O /usr/share/keyrings/azlux-archive-keyring.gpg https://azlux.fr/repo.gpg
sudo tee /etc/apt/sources.list.d/azlux.list >/dev/null <<EOF
deb [signed-by=/usr/share/keyrings/azlux-archive-keyring.gpg] http://packages.azlux.fr/debian/ $VERSION_CODENAME main
EOF
# Debian 13 Trixie needs a better Log2Ram source; see https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=1122989
[ "$VERSION_CODENAME" = trixie ] && sudo tee /etc/apt/preferences.d/log2ram.pref >/dev/null <<EOF
Package: log2ram
Pin: origin packages.azlux.fr
Pin-Priority: 1001
EOF
sudo apt update
sudo apt install log2ram
```

### Manual Installation
```zsh
# Download source files and extract
curl -L https://github.com/azlux/log2ram/archive/master.tar.gz | tar zxf -

# Navigate to directory, verify root permissions, and run install script
cd log2ram-master
chmod +x install.sh && sudo ./install.sh

# Clean up installer
cd ..
rm -r log2ram-master
```

Install 

Reboot the pi
```zsh
sudo reboot
```

## Configuration
You can modify the configuration file:
```zsh
sudo nano /etc/log2ram.conf
```

## Log storage
You should see that Log2RAM by default reserves 128MB of RAM to store logs. Since the Pi 2B only has 1GB of RAM, we don't want the log buffer to be too big, else it steals from the containers. Likewise, ff it's too small, it will crash when the buffer fills up.

I recommend setting it to 50MB. It should be enough to hold a few days of system logs while small enough to not negatively affect the other containers.

Set `SIZE=50M`

## Synchronisation Mechanism 
Log2RAM employs two different tools for synchonization: [`rsync`](https://manpages.debian.org/buster/rsync/rsync.1.en.html) and `cp`. The Log2RAM team recommends `rsync` for better performances. 

`rsync` is included in Debian releases, so you just have to enable it.

set `USE_RSYNC=true`

## Aligning `journald`
Journald is a logging service in Debian that collects and stores logs (You can read more about it [here](https://www.siberoloji.com/how-to-configure-advanced-logging-with-journald-on-debian-12-bookworm/)). We want to make sure it doesn't try to store massive binary logs that could overflow the 50MB of log storage.

I suggest forcing the OS to delete old system logs once they hit 20MB, so there's 30MB free for the Log2RAM buffer for text logs in `/var/log`

- Edit the `journald` config file
```zsh
sudo nano /etc/systemd/journald.conf
```

- Uncomment and set these values
```conf
SystemMaxUse=20M
RuntimeMaxUse=20M
```