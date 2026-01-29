---
tags:
created: 2026-01-17
updated:
categories:
  - Initial Setup
  - Unfinished
---
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