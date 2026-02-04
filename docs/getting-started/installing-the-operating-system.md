---
tags:
created: 2026-01-17
updated:
categories:
  - Initial Setup
  - Unfinished
title: Installing the OS
---
> [!NOTE]
> This setup is written for Raspbian OS Trixie 13 on kernel version 6.12.62+rpt-rpi-v7

# Installing the OS
This is just a short guide on installing the OS. See the official documentation for the full in-depth guide ([link](https://www.raspberrypi.com/documentation/computers/getting-started.html#installing-the-operating-system))

3GB of storage will be reserved for your OS.

## Raspberry Pi Imager
- Downloading the [Raspberry Pi Imager](https://www.raspberrypi.com/software/) really just makes the installation process easier

Download the imager here ([link](https://www.raspberrypi.com/software/))

If you're on an Linux running Ubuntu or a similar distro, you can also run this command in the terminal:
```zsh
sudo apt install rpi-imager
```


- Setup options
	- Raspberry Pi Device -> Raspberry Pi 2
	- Operating System -> Raspberry Pi OS (other) -> RPi OS Lite (32-bit)
		- Legacy (Debian Buster release) is intended for users who may face compatibility issues with the newer Debian Bullseye release. ([source](https://www.hackster.io/news/raspberry-pi-launches-legacy-operating-system-for-those-finding-the-shift-to-bullseye-a-challenge-dbb9f9c4f40d))
	- OS Customisation
		- Hostname: basically a label for your device in the network

## Manual Installation
- Alternatively, install the OS on its own w/o the imager ([link](https://www.raspberrypi.com/software/operating-systems/))
- For the purpose of this project, download Raspberry Pi OS Lite (32-bit)
- Full archived versions ([link](https://downloads.raspberrypi.com/raspios_lite_armhf/images/))
- You would need an app to copy the image to your SD card