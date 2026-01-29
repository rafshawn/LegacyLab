---
tags:
  - Docker
created: 2026-01-12
updated: 2026-01-14
categories:
  - Unfinished
  - Initial Setup
---
# Installing Docker
> [!WARNING]
> [As per the Docker team](https://docs.docker.com/engine/install/raspberry-pi-os/), Docker Engine v28 is the last major version to support `armhf`. The Docker team recommends installing Debian `armhf` packages for ARMv7 CPUs.

This section will go over installing [Docker Engine](https://docs.docker.com/engine/) on **Debian 13** (*Trixie*).
## Overview
Docker is used to create, deploy, and run applications in [containers](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/)--lightweight isolated environments that contain only what's needed to run an application: *code*, *libraries*, *dependencies*, and *configurations*.

Basically, think of Docker containers like a box that bundles everything needed to run an app on its own, nothing else. These apps are portable and not tied to your infrastructure.

While this isn't exactly a lesson on Docker, you should read up the [Docker Overview](https://docs.docker.com/get-started/docker-overview/) to learn a bit more about it.

The key thing to know is that we're using Docker because it's the modern way of organizing applications and it adds a layer of privacy and security. ***(Fix)***
## Docker Engine

> [!IMPORTANT]
> The [official documentation](https://docs.docker.com/engine/install/raspberry-pi-os/) best describes how to install Docker Engine on Raspberry Pi OS (32-bit / `armhf`). If you're on a newer Pi, see the [Debian install guide](https://docs.docker.com/engine/install/debian/).

Docker Engine needs to be installed on [RPi OS](https://en.wikipedia.org/wiki/Raspberry_Pi_OS#Releases) on **Debian 12** (*Bookworm, stable*) or **11** (*Bullseye, oldstable*).

Run `hostnamectl` in the terminal to check which version you're on.

The Docker team recommends installing the Docker packages maintained by the Debian team. These packages use an older version of Docker (see *[manpage](https://manpages.debian.org/trixie/docker.io/docker.1.en.html)*). If you want to install the official packages, [skip to the next section](#docker-repo).

You can install these packages by running the command:
```zsh
sudo apt-get install docker.io docker-cli containerd docker-buildx docker-compose-v2
```
### Docker Repo
> [!WARNING]
> The unofficial packages will conflict with the official release. Make sure you remove them if you have them installed.

Since the official release of Docker Engine is not in the Pi's APT repo (see [Software Sources](https://www.raspberrypi.com/documentation/computers/software-sources.html)), running `apt search docker` will pull up only the unofficial packages.

The table below describes which package corresponds to what:

| Official Docker Package | Debian `apt` repo   | Description                    |
| ----------------------- | ------------------- | ------------------------------ |
| `docker-ce`             | `docker.io`         | The Docker Engine/daemon       |
| `docker-ce-cli`         | `docker-cli`        | Docker Command Line Interface  |
| `container.io`          | `containerd`        | Container runtime              |
| `docker-buildx-plugin`  | `docker-buildx`     | Modern build engine (BuildKit) |
| `docker-compose-plugin` | `docker-compose-v2` | Docker Compose                 |

1. Set up Docker's `apt` repo
```zsh
# 1. Add Docker's official GPG key
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/raspbian/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# 2. Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/raspbian \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable"

# 3. A new `docker.list` file should be added to the sources
sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```

> [!NOTE]
> If you're on Trixie 13, you will run into an error. See [*Docker on Trixie 13*](#docker-on-trixie-13)

2. Install the Docker packages
```zsh
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```
3. Verify Docker is running/installed successfully
```zsh
sudo systemctl status docker
sudo docker run hello-world
```
4. See [Post-install Steps](https://docs.docker.com/engine/install/linux-postinstall/)
	- See *Logging*
### Docker on Trixie 13

As of writing, it doesn't look like there's an official release of Docker Engine for RPi OS on Debian 13 (Trixie).
- If you go to [`https://download.docker.com/linux/raspbian/dists/`](https://download.docker.com/linux/raspbian/dists/), it shows releases for **Debian 8** (*Stretch*) through **Debian 12** (*Bookworm*)
- This may change? For now, ignore this section if you're not on Trixie 13.

Because of this, running `sudo apt-get update` will return a `404 error` when trying to look for `https://download.docker.com/linux/raspbian/dists/trixie/`

To fix this, just point the repo to the bookworm release of the docker engine.
- Instead of running the command that auto detects your system version, you'd want to explicitly tell it to pull from the latest stable release (Bookworm)
- i.e., edit `docker.list` and point the repo to `bookworm` instead of the dynamic variable `$VERSION_CODENAME`.
```zsh
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/raspbian bookworm stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

## Docker Compose
This is the tool to define and run multi-container apps. Managing services, networks, and volumes are done from a single YAML config file. You then start all the services from the config file by running a single command. 

Remember from earlier we fixed the repo issue? Now just install Docker Compose from the command line:
```zsh
sudo apt-get install docker-compose-plugin
```

Check that it installed correctly
```zsh
docker compose version
```

