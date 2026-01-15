---
tags:
  - Homelab
  - RaspberryPi
created: 2026-01-12
updated: 2026-01-14
categories:
  - Homelab
---
Using Docker on a RPi: The modern way of organizing applications
# The "Client-Server" Architecture
1. The Docker Engine (The Server/Daemon): Manages the containers, images, and networking. 
	- Lives exclusively in the Raspberry Pi.
2. The Docker CLI (The Client): The command line tool used to tell the Engine what to do.

# What is Docker?
(See [Docker Overview](https://docs.docker.com/get-started/docker-overview/))
Docker basically separates applications from infrastructure, essentially having them run in their own isolated environment. These isolated environments also contain software code and are called containers.

To me, it sounds quite like a VM, but here's a good video that explains the difference.
https://www.youtube.com/watch?v=0pofNK1JxjM

Here's an article in more detail:
https://aws.amazon.com/compare/the-difference-between-docker-vm/

Basically, think of Docker containers like a box that bundles everything needed to run an app on its own, as if it's just the app and nothing else.

Meanwhile, a VM is literally like having another computer inside your computer, and just like an actual computer, it has a fixed amount of resources that you set and it runs its own kernel and OS.

Here's a table to compare them if you're curious:

| Virtual Machines              | Containers                            |
| ----------------------------- | ------------------------------------- |
| Heavyweight                   | Lightweight                           |
| Limited Performance           | Native Performance                    |
| Each VM runs its own OS       | Containers share the host OS          |
| Hardware-level virtualisation | OS virtualisation                     |
| Slower startup (minutes)      | Faster startup (milliseconds)         |
| Allocates required memory     | Requires less memory                  |
| Full isolation = More secure  | Process-level isolation = Less secure |
An interesting analogy would be like comparing a guest house and an apartment.
1. Guest House (VM)
	- In this case, a VM is like a guest house.
	- It's not necessarily attached to the main house, but it sits in the same plot of land.
	- It has its own foundation, plumbing, electrical panel, and front door.
	- If the guest house is empty, it still consumes energy just for the fact that it exists.
	- A guest house is literally a smaller duplicate of the main house.
2. Apartment Unit (Container)
	- A docker container is like an apartment unit; each sharing the same foundation, water line, and structural walls.
	- While they share the same infrastructure (of the building), they're isolated from each other.
	- If an apartment is empty, it basically consumes no energy because it's essentially an empty room.
	- Sharing the same building is virtually the same as sharing the host kernel.

*(To organize/fix this section)*
## Docker Engine
- The [official documentation](https://docs.docker.com/engine/install/raspberry-pi-os/) describes best how to install Docker Engine on Raspberry Pi OS (32-bit / `armhf`).
	- As per their note, Docker Engine v28 is the lats major version to support armhf.
	- Docker recommends installing Debian `armhf` packages for ARMv7 CPUs.
	- The Pi 2B has an AMRv7 CPU, but you can double check by running this terminal command:
```zsh
cat /proc/cpuinfo
```
- The official release of Docker Engine is not in the Pi's APT repo. (see [Software Sources](https://www.raspberrypi.com/documentation/computers/software-sources.html))
- Running `apt search docker` will pull up unofficial packages that will conflict with the official release, including:
	- `docker.io`
	- `docker-compose`
	- `docker-doc`
	- `podman-docker`

1. Set up Docker's `apt` repo (see documentation)
	- Add Docker's official GPG key.
	- Then, add the repository to APT sources.
		- *Is there a way to install Docker Engine on Trixie 13?*
	- A new `docker.list` file should be added to `/etc/apt/sources.list.d`
	- `sudo apt-get update`
	- You may run into a probelm with Trixie 13 (See [*Docker on Trixie 13*](#Docker-on-Trixie-13))

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
- Documentation states that Docker Engine needs to be installed on [RPi OS](https://en.wikipedia.org/wiki/Raspberry_Pi_OS#Releases) on Debian versions 12 (Bookworm, stable) or 11 (Bullseye, oldstable).
	- Run `hostnamectl` to check what version you're on.
- As of writing, it doesn't look like there's an official release of Docker Engine for RPi OS on Debian 13 (Trixie).
	- If you go to [`https://download.docker.com/linux/raspbian/dists/`](https://download.docker.com/linux/raspbian/dists/), it shows releases for Debian 8 (Stretch) through Debian 12 (Bookworm)
	- This may change?
- Because of this, running `sudo apt-get update` will return a 404 error when trying to look for `https://download.docker.com/linux/raspbian/dists/trixie/`
- To fix this, just point the repo to the bookworm release of the docker engine.
	- Instead of running the command that auto detects your system version, you'd want to explicitly tell it to pull from the latest stable release (Bookworm)
	- i.e., edit `docker.list` and point the repo to `bookworm` instead of the dynamic variable `$VERSION_CODENAME`.
```zsh
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/raspbian bookworm stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```
- Alternatively, install the Docker packages maintained by the Debian Team.
	- Run `sudo apt install docker.io`
	- This is a package maintained by the Debian Team rather than Docker Inc. and an uses older version of Docker (see [manpage](https://manpages.debian.org/trixie/docker.io/docker.1.en.html))
	- Using docker stays the same, probably just less likely to run into dependency issues.

| Official Docker Package | Debian `apt` repo   | Description                    |
| ----------------------- | ------------------- | ------------------------------ |
| `docker-ce`             | `docker.io`         | The Docker Engine/daemon       |
| `docker-ce-cli`         | `docker-cli`        | Docker Command Line Interface  |
| `container.io`          | `containerd`        | Container runtime              |
| `docker-buildx-plugin`  | `docker-buildx`     | Modern build engine (BuildKit) |
| `docker-compose-plugin` | `docker-compose-v2` | Docker Compose                 |
## Containers
- Pre-fabricated appliations
	- Can find existing containers on dockerhub
	- Contain only what is required
	- Smaller than VMs because don't include OS
	- Can start/stop specific containers w/o affecting other containers/Docker