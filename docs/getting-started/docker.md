---
title: Docker
tags:
  - Docker
created: 2026-01-12
updated: 2026-01-14
categories:
  - Unfinished
  - Initial Setup
---
# Docker
> [!WARNING]
> [As per the Docker team](https://docs.docker.com/engine/install/raspberry-pi-os/), Docker Engine v28 is the **last major version** to support `armhf`. They recommend installing Debian's `armhf` packages for ARMv7 CPUs.

This guide covers installing [**Docker Engine**](https://docs.docker.com/engine/) on **Debian 13 (Trixie)**.
## Overview
Docker runs applications in [**containers**](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/)—lightweight isolated environments that contain only what's needed to run an application: *code*, *libraries*, *dependencies*, and *configurations*.

Think of a container like a box that bundles everything needed to run an app on its own, nothing else. It's designed to run the same way anywhere (i.e., portable and not tied to your infrastructure).

We're using Docker because it simplifies app deployment and isolates services for better security and privacy. For more, check out the offical [Docker Overview](https://docs.docker.com/get-started/docker-overview/).
## Installing Docker Engine

> [!IMPORTANT]
> The [official install guide](https://docs.docker.com/engine/install/raspberry-pi-os/) covers Raspberry Pi OS (32-bit / `armhf`). If you're on a 64-bit system or a newer Pi, follow the [Debian install guide](https://docs.docker.com/engine/install/debian/) instead.

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

Since the official release of Docker Engine is not in the Pi's APT repo (*see [Software Sources](https://www.raspberrypi.com/documentation/computers/software-sources.html)*), running `apt search docker` will pull up only the unofficial packages.

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

As of writing, it doesn't look like there's an official release for Trixie (Debian 13) on `armhf`.
- The repo at [`download.docker.com/linux/raspbian/dists/`](https://download.docker.com/linux/raspbian/dists/) shows only releases for **Stretch (Debian 8)** through **Bookworm (Debian 12)**
- This may change? For now, ignore this section if you're not on Trixie 13.

Because of this, running `sudo apt-get update` will return a `404 error` when trying to look for `https://download.docker.com/linux/raspbian/dists/trixie/`

To fix this, just point the repo to the **Bookworm** release.
- Instead of running the command that auto detects your system version, you'd want to explicitly tell it to pull from the latest stable release (Bookworm)
- i.e., edit `docker.list` and point the repo to `bookworm` instead of the dynamic variable `$VERSION_CODENAME`.
```zsh
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/raspbian bookworm stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
```

## Docker Compose
This tool lets you define and run **multi-container apps**. Managing services, networks, and volumes are done from a single `docker-compose.yml` file. You then start all the services from the config file by running a single command. 

Remember from earlier we fixed the repo issue? Now just install Docker Compose from the command line:
```zsh
sudo apt-get install docker-compose-plugin
```

Check that it installed correctly
```zsh
docker compose version
```

