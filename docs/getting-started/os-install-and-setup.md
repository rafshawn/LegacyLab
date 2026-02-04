---
title: OS Install and Setup
tags:
  - Setup
created: 2026-01-17
updated: 2026-02-04
categories:
  - Initial Setup
  - Unfinished
---
# OS Install and Setup
This setup is written for Raspi OS Lite (Trixie) on kernel `v6.12.62`.

3 GB of storage will be reserved for your OS. See the [full in-depth guide](https://www.raspberrypi.com/documentation/computers/getting-started.html#installing-the-operating-system).

## Flashing the OS
### Raspberry Pi Imager
1. Install and launch imager
::: tabs
== Linux (Debian/Ubuntu)
```zsh
sudo apt install rpi-imager
```

== Windows / macOS / Linux (Other)
Download the imager: [`raspberrypi.com/software/`](https://www.raspberrypi.com/software/)
:::

2. Configure your setup
	- **Device** → *Raspberry Pi 2*
	- **OS** → Raspberry Pi OS (other) → *RPi OS Lite (32-bit)*
	- **OS Customisation**:
		- **General**
			- *Set hostname*
				- The Pi's network label
				- Defaults to `raspberrypi`
			- *Set username and password*
				- This is what you'll use to log in
			- Configure wireless LAN
				- The Pi 2B has no Wi-Fi. You can leave this one off
		- **Services**
			- *Enable SSH*

### Manual Install
- Download the image directly: [Raspberry Pi OS Lite (32-bit) archive](https://downloads.raspberrypi.com/raspios_lite_armhf/images/)
- You would need an app to copy the image to your SD card

## Post-Install Setup
Since we're building a headless setup, you won't need to connect a monitor and keyboard to the Pi. But, we do need to make sure our Pi is connected to the network.

1. Insert SD card, connect Ethernet and micro-USB.
2. Wait for a minute or so for the Pi to boot.
3. Check to see if the Pi is connected and discoverable:
```zsh
# Replace 'raspberrypi' with your hostname
ping raspberrypi.local
```

If successfully connected, the output will show the IP address and replies. Otherwise, you will get this output:
```zsh
ping: raspberrypi.local: Name or service not known
```

Alternatively, you can see check you router's admin page or use [Angry IP Scanner](https://angryip.org/download). Most routers use the default address `192.168.0.1` or `192.168.1.1`. The Pi's hostname and IP address should appear here.
### Remote Access
You can read more about [remote access](https://www.raspberrypi.com/documentation/computers/remote-access.html) in the official documentation.
#### SSH
[SSH](https://www.ssh.com/academy/ssh) provides secure remote access to a terminal session on the Pi. It's disabled by default. If you didn't use the imager or enable it, you can create an empty file named `ssh` in the boot partition.
```zsh
touch /<path-to-bootfs>/ssh
```
This file tells the Pi to enable SSH and is then deleted on first boot.

Alternatively, connect a monitor and enable SSH through [`raspi-config`](https://www.raspberrypi.com/documentation/computers/configuration.html#network-interface-names).
```zsh
sudo raspi-config
```
From here go to the Interfaces submenu and enable `ssh`.

If you're on a Linux or Mac, SSH is likely already built into the terminal. You can connect to the Pi by simply running the command:
```zsh
ssh <username>@<ip-address>
# or ssh <username>@<hostname>.local
```

If you're on Windows, you need an SSH terminal. Most people recommend [PuTTY](https://putty.software/), a secure remote terminal emulator. Other alternatives exist too:
- **OpenSSH**: Included with W10 and Windows Server 2019 and natively supports `ssh` and `scp` commands.
- **Windows Subsystem for Linux (WSL)**
- **Git Bash**
- **Moba Xterm**
- **Solar-PuTTY**: A fork of PuTTY with added utilities and features
- **Remmina**: Open source, supports SSH, RDP, VNC, NX, and other protocols.

There may be a reason someone would install PuTTY on a Linux, but [this article](https://itsfoss.gitlab.io/post/how-to-install-and-use-putty-on-linux/) would probably better explain it.

#### Raspberry Pi Connect
[Raspberry Pi Connect](https://www.raspberrypi.com/software/connect/) lets you connect to a remote session outside of your local network. Connect Lite only supports remote shell, and it's basically SSH-ing from your browser. You just link a Raspberry Pi device to a connect account, *et-voila*!

The [official documentation](https://www.raspberrypi.com/documentation/services/connect.html) would do more justice explaining this.
### Updating OS
After initial OS setup, you should get the latest packages. Run the following command:
```zsh
sudo apt update -y && sudo apt upgrade -y
sudo reboot
```
### Disabling Unused Interfaces
Since building a headless setup, disable unused hardware interfaces to 

```zsh
sudo raspi-config
```
→ _Interface Options_ → Disable:
- SPI
- I2C
- Serial Port
- 1-Wire

Since the Pi 2B only has 1GB of RAM, we want to minimise background interrupts and ensure CPU cycles are dedicated to running services. You can consider enabling some later to integrate an OLED status screen or something else.