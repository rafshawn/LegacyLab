---
tags:
created: 2026-01-17
updated:
categories:
  - Initial Setup
  - Unfinished
---
# Introduction
This guide assumes the following:
- You're at least a beginner with a basic understanding of how to use the Linux terminal.
- Your hardware: Raspberry Pi 2B (rev 1.1, the one with a 32-bit processor).
- You're installing Raspberry Pi OS Lite (v6.1, Debian 13 Trixie, 32-bit armhf).
- Have at least 16 GB of storage space (SD Card).
- You're probably starting from scratch.

If this is your first time with a Raspberry Pi, I recommend playing around with it before you delve into this project. The official documentation has a good guide on [getting started](https://www.raspberrypi.com/documentation/computers/getting-started.html). It covers everything from getting to know your Pi, learning to set it up, and configuring it once it's up and running.

> [!NOTE]
> If at any point of your setup you run across a problem or found an alternate/method solution to an issue, feel free to contribute by creating a pull request!
## Understanding your Hardware
There are three different versions of the 2B, it's good to know which version you have. The v1.1 of the board runs on an ARMv7 chip that limits support to 32-bit, among other hardware limitations.[^1] The scale of the project shouldn't make that much of an issue though. 

The 2B also doesn't have a Wi-Fi card, so you'll need to use an ethernet cable.

If you want more detailed info, here's a table of the [Raspberry Pi 2B specs](https://www.raspberrypi.com/products/raspberry-pi-2-model-b/)

| Component          | Specs                              | Notes                        |
| ------------------ | ---------------------------------- | ---------------------------- |
| CPU (Rev 1.1)      | ARM Cortex-A7 quad-core (BCM2836)  | 32-bit ARMv7                 |
| CPU (Revs 1.2-1.3) | ARM Cortex-A53 quad-core (BCM2837) | 64-bit ARMv8                 |
| Memory (RAM)       | 1 GB LPDDR2                        | shared with GPU              |
| Networking         | 10/100                             | 100 Base-T                   |
| USB Ports          | 4 x USB 2.0                        |                              |
| GPIO               | 40-pin header                      |                              |
| Video out          | HDMI                               | Full-size HDMI               |
| Audio / Video      | 3.5 mm jack                        | Audio + Composite Video      |
| Camera interface   | CSI                                | MIPI CSI-2                   |
| Display Interface  | DSI                                | MIPI DSI                     |
| Storage            | MicroSD card slot                  | 256 GB or less (Rev 1.1)[^1] |
| Graphics           | VideoCore IV                       | OpenGL ES 2.0                |
| Power Input        | 12.5 W Micro-USB                   | 5 V / 2.6 A                  |
### How do I check which version I have?
Check the board. It's etched near the GPIO pins or somewhere in the centre of the board.

You can also run command this in the terminal to return the Pi's model:
```zsh
cat /proc/device-tree/model
```

Or this to get ,more detailed info:
```zsh
cat /proc/cpuinfo
```

## What if I have a different board?
While this guide is meant for users with hardware constraints and you *probably could* do this project on a Pi 1 or a Zero/Zero W, I would just recommend running a single service like Pi-hole on it. It has limited resources and would probably be more trouble to set up Docker containers. Anyway, Docker [officially stopped support](https://docs.docker.com/engine/install/raspberry-pi-os/) for devices with ARMv6 architecture.


[^1]: Due to hardware limitations, Rev 1.1 will only boot from a boot partition of 256 GB or less. See [*Getting Started with your Raspberry Pi*](https://www.raspberrypi.com/documentation/computers/getting-started.html#recommended-sd-cards)