---
tags:
  - RaspberryPi
  - Homelab
created: 2026-01-03
updated: 2026-01-13
categories:
  - Homelab
---
This guide assumes you:
- Your hardware: Raspberry Pi 2B (rev 1.1, the one with a 32-bit processor)
- You have Raspberry Pi OS Lite installed (v6.1, Debian 13 Trixie, 32-bit armhf)
- Have at least 16 GB of storage space (SD Card)
- Probably installing from scratch


- **GOAL**: Set up Pi-hole and Unbound on in a individual Docker Container.
# Operating System & Storage
# [Raspberry Pi 2B Specs](https://www.raspberrypi.com/products/raspberry-pi-2-model-b/)
- **Processor:**
	- 900 MHz Arm Cortex-A7 quad-core processor (*rev 1.1*)
	- 900MHz Arm Cortex-A53 quad-core 64-bit processor (*revs 1.2 and 1.3*)
		- Rev 1.3 uses the updated Broadcom 2837B0 processor
	- ([Need to double check this](https://raspiserver.com/how-to-check-which-raspberry-pi-version-you-have/))
- 1GB RAM
- 100 Base Ethernet
- 4 USB 2.0 Ports
- 40 GPIO Pins
- HDMI port
- Combined 3.5mm audio jack and composite video
- Camera interface (CSI)
- Display interface (DSI)
- Micro SD card slot
- VideoCore IV 3D graphics core

## The unfortunate part
- Checked the Pi that I got, the board indicates that it's v1.1, so it looks like it runs on 32-bit architecture.
- Also, this model does not have a Wi-Fi card, only Ethernet.
# Choosing the OS
## Raspberry Pi OS Lite
- Traditional Linux experience minus the desktop bloat.
- Perfect for projects that utilise GPIO.
	- Sensors
	- HATs
	- etc.
- Includes all RPi specific tools, drivers, and libraries out of the box.
## DietPi OS
- Favours optimisation and ease of use.
- Perfect for server and appliance projects (web, file, media)
- Board agnostic
	- i.e., compatible with other SBCs
	- even VMs

(Note)
This setup is written for Raspbian OS Trixie 13 on kernel version 6.12.62+rpt-rpi-v7
# Installing the OS
- Downloading the [Raspberry Pi Imager](https://www.raspberrypi.com/software/) really just makes the installation process easier
```zsh
sudo apt install rpi-imager
```
- Setup options
	- Raspberry Pi Device -> Raspberry Pi 2
	- Operating System -> Raspberry Pi OS (other) -> RPi OS Lite (32-bit)
		- Legacy (Debian Buster release) is intended for users who may face compatibility issues with the newer Debian Bullseye release. ([source](https://www.hackster.io/news/raspberry-pi-launches-legacy-operating-system-for-those-finding-the-shift-to-bullseye-a-challenge-dbb9f9c4f40d))
	- OS Customisation
		- Hostname: basically a label for your device in the network
- Alternatively, install the OS on its own w/o the imager ([link](https://www.raspberrypi.com/software/operating-systems/))

# Setting up the OS
- If not connecting to a keyboard/monitor, you can SSH to the pi. Make sure it's on and connected to your network first though.
- Ping the pi to see if it's connected to the local network. Run the command below if you have it set with the default hostname.
```zsh
ping raspberrypi.local
```
- If not connected, you will get this:
```zsh
ping: raspberrypi.local: Name or service not known
```
Otherwise, you will get the IP address and bytes of data or something.
- Alternatively, you can see if the device is connected to your network through your router's dashboard via its local IP or use [Angry IP Scanner](https://angryip.org/download)
You can also check your router's dashboard from your browser to see the list of devices. The Pi's hostname and address should appear here. Most routers use the default address `192.168.0.1` or `192.168.1.1`. 
## Remote Access
- It is recommended to connect to a monitor and keyboard on first setup, but in the case this is not possible...
- If no monitor or keyboard is available to use, look through '[Remote access](https://www.raspberrypi.com/documentation/computers/remote-access.html)' in the documentation.
- Over the local network, you can connect either through:
	- SSH: Secure Shell
		- Provides secure access to a terminal session on the Pi.
		- This is disabled by default, so it needs to be enabled first.
	- VNC: Virtual Network Computing
		- Provides secure access to a desktop screen share. Basically remote desktop.
		- This is also disabled by default.
	- [Raspberry Pi Connect](https://www.raspberrypi.com/software/connect/)
		- Shares the Pi's screen securely w/o needing the local IP address.
### Connecting via SSH
Since SSH is disabled by default, it needs to be enabled first. If RPi OS was installed using the imager, you can set it up there. Otherwise, create an empty file named `ssh` in the boot partition after installation.
```zsh
touch /<path to bootfs>/ssh
```
This is an empty file that tells the Pi to enable SSH on boot The file is deleted after the first boot.

Alternatively (obviously), connect a monitor and enable SSH through `raspi-config`.
```zsh
sudo raspi-config
```
From here go to the Interfaces submenu and enable `ssh`.

If you're on a Unix based OS, SSH is usually already built into the terminal (unless you're on some weird thing that doesn't have it). You can connect to the Pi by simply running the command:
```zsh
ssh <username>@<IP-address>
```
Where `<username>` is the login and `<IP-address>` is the Pi's local address

If you're on Windows, you need an SSH terminal. Most people recommend [PuTTY](https://putty.software/), a secure remote terminal emulator. Other alternatives exist too:
- **OpenSSH**: Included with W10 and Windows Server 2019 and natively supports `ssh` and `scp` commands.
- **Windows Subsystem for Linux (WSL)**
- **Git Bash**
- **Moba Xterm**
- **Solar-PuTTY**: A fork of PuTTY with added utilities and features
- **Remmina**: Open source, supports SSH, RDP, VNC, NX, and other protocols.

There may be a reason someone would install PuTTY on a Linux, but [this article](https://itsfoss.gitlab.io/post/how-to-install-and-use-putty-on-linux/) would probably better explain it.
### Connecting via VNC
Unlike `ssh`, you can't create an empty `vnc` file in the boot partition to enable it. Instead, you have to enable it through `raspi-config`.

But why use VNC when there's no desktop interface to see anyway? Just stick to SSH-ing. If you insist, look into what you can use but here's a few free recommendations from the web:
- [NoMachine](https://www.nomachine.com/)
- [Guacamole](https://guacamole.apache.org/)
- [rustdesk](https://rustdesk.com/)
- [MeshCentral](https://github.com/Ylianst/MeshCentral)
- [X2Go](https://wiki.x2go.org/doku.php/start)
### Connecting via Raspberry Pi Connect
Connect Lite is the variant that only supports remote shell. It's kind of like SSH-ing. You basically have to link a Raspberry Pi device to a connect account. After that, you can connect through your browser from anywhere.

The [official documentation](https://www.raspberrypi.com/documentation/services/connect.html) would do more justice explaining this.
## Updating OS
After initial OS setup, best practice is to update the OS to get the latest packages. Run the following command:
```zsh
sudo apt update -y && sudo apt upgrade -y
```
Then, reboot the system.
```zsh
sudo reboot
```
## Headless Setup
- Since the goal of this project is to build a headless networking and web server, disable unused services/HW interfaces:
	- SPI
	- I2C
	- Serial Port
	- 1-Wire
- Maybe consider enabling SPI/I2C later to integrate an OLED status screen or something.
- The idea is to ensure maximum stability for the networking stack. 
- Since there's only 1GB of RAM, disable all non-essential HW interfaces to minimise background interrupts and ensure CPU cycles dedicated entirely to what it was meant for.
- i.e., focus on performance tuning.

# Setting up Docker
# Next Steps:
- [x] Install OS
- [ ] Knowledge & Reading
	- [ ] Understand DDNS and check if this applies to me
- [ ] Set up logging
	- [ ] Docker logging drivers
	- [ ] Log2RAM
- [ ] Set up Docker containers
	- [ ] Troubleshoot Docker's `apt` repo (`trixie Release` file does not exist, check guide?)
- [ ] Set up Pi-hole as a container
- [ ] Set up Nginx
- [ ] Set up CouchDb (for obsidian notes hosting)
- [ ] Set up [uptime-kuma](https://github.com/louislam/uptime-kuma)
- [ ] Finish documentation

# Resources
- Here's an excellent [YouTube video](https://www.youtube.com/watch?v=FnFtWsZ8IP0) on setting up Pi-hole as a [Recursive DNS](https://www.geeksforgeeks.org/ethical-hacking/what-is-recursive-dns/) Server.
	- This is also excellent to combat against [DNS Spoofing](www.cloudflare.com/en-ca/learning/dns/dns-cache-poisoning/).