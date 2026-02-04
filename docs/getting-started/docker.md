---
title: Docker
tags:
  - Docker
  - Setup
created: 2026-01-12
updated: 2026-02-04
categories:
  - Unfinished
  - Initial Setup
---
# Docker
Docker is used to run applications in [**containers**](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/)—lightweight isolated environments that contain only what's needed: *code*, *libraries*, *dependencies*, and *configurations*.

It simplifies app deployment and isolates services for better security and privacy.

Think of it like a box that bundles everything needed to run an app on its own. It's designed to run the same way anywhere (i.e., portable and not tied to your infrastructure).

*For more, check out the offical [Docker Overview](https://docs.docker.com/get-started/docker-overview/).*
## Docker Engine
> [!WARNING]
> [As per the Docker team](https://docs.docker.com/engine/install/raspberry-pi-os/), Docker Engine v28 is the **last major version** to support `armhf`. They recommend installing Debian's `armhf` packages for ARMv7 CPUs.

[Docker Engine](https://docs.docker.com/engine/) is the core software that runs and manages containers on the Pi. We're using it to run apps without cluttering the OS or worrying about dependency conflicts.
### Prerequisites
Docker officially supports the following OS [releases](https://en.wikipedia.org/wiki/Raspberry_Pi_OS#Releases):
- Bookworm (Debian 12, stable)
- Bullseye (Debian 11, oldstable)

You can check which version you're on by running:
```zsh
hostnamectl
```

If you're on Trixie (Debian 13), we'll cover that in the next section.
### Installation

> [!IMPORTANT]
> The [official install guide](https://docs.docker.com/engine/install/raspberry-pi-os/) covers Raspberry Pi OS (32-bit / `armhf`) in detail. If you're on a 64-bit system or a newer Pi, follow the [Debian install guide](https://docs.docker.com/engine/install/debian/) instead.

The Docker team recommends installing packages maintained by Debian, which use an older version of Docker (see *[manpage](https://manpages.debian.org/trixie/docker.io/docker.1.en.html)*).

Since the official release is not in the Pi's APT repo (*see [Software Sources](https://www.raspberrypi.com/documentation/computers/software-sources.html)*), running `apt search docker` will only show Debian's packages.

How the packages compare:

| Docker Official         | Debian `apt` repo   | Description                    |
| ----------------------- | ------------------- | ------------------------------ |
| `docker-ce`             | `docker.io`         | Docker Engine (daemon)         |
| `docker-ce-cli`         | `docker-cli`        | Command Line Interface         |
| `container.io`          | `containerd`        | Container runtime              |
| `docker-buildx-plugin`  | `docker-buildx`     | Modern build engine (BuildKit) |
| `docker-compose-plugin` | `docker-compose-v2` | Multi-container orchestration  |

You're free to choose, but Debian's packages will probably be enough to handle the containers we're running for this project (and it's easier to install).

::: tabs
== Debian Packages
1. Install the packages by running:
```zsh
sudo apt-get install docker.io docker-cli containerd docker-buildx docker-compose-v2
```
2. Verify Docker is running/installed successfully
```zsh
sudo systemctl status docker
sudo docker run hello-world
```

== Official Docker Packages
> [!WARNING]
> If you're on Trixie 13, you will run into an error. See [*Docker on Trixie 13*](#docker-on-trixie-13)

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
2. Install the Docker packages
```zsh
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```
3. Verify Docker is running/installed successfully
```zsh
sudo systemctl status docker
sudo docker run hello-world
```
:::
### Docker on Trixie 13

As of writing, it doesn't look like there's an official release for Trixie (Debian 13) on `armhf`.
- The repo at [`download.docker.com/linux/raspbian/dists/`](https://download.docker.com/linux/raspbian/dists/) shows only releases for **Stretch (Debian 8)** through **Bookworm (Debian 12)**
- This may change? For now, ignore this section if you're not on Trixie 13.

Because of this, running `sudo apt-get update` will return a ***404 error*** when trying to look for `https://download.docker.com/linux/raspbian/dists/trixie/`

To fix this, just point the repo to the **Bookworm** release.
- Instead of running the command that auto detects your system version, you'd want to explicitly tell it to pull from the latest stable release (Bookworm)
- i.e., edit `docker.list` and point the repo to `bookworm` instead of the dynamic variable `$VERSION_CODENAME`.
```zsh
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/raspbian bookworm stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

## Docker Compose
[Docker Compose](https://docs.docker.com/compose/) define and run **multi-container apps** from a single `docker-compose.yml` file. You then start all the services from the config file by running a single command. 

Check that it installed correctly
```zsh
docker compose version
```