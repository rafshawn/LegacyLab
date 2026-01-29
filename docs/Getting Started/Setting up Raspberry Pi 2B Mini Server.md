---
tags:
created: 2026-01-03
updated: 2026-01-13
categories:
  - Initial Setup
  - Unfinished
---
This guide assumes you:


- **GOAL**: Set up Pi-hole and Unbound on in a individual Docker Container.



NOTE 2: Installing DietPi is still probably the easiest way to set up containers for an IoT stack, but the point of this guide is to also understand the inner workings of what it is that you're setting up instead of just a plug-and-play.

# Operating System & Storage



# Setting up Docker
# Next Steps:
- [x] Install OS
- [ ] Knowledge & Reading
	- [ ] Understand DDNS and check if this applies to me
- [x] Set up logging
	- [x] Docker logging drivers
	- [x] Log2RAM
- [x] Set up Docker
	- [x] Docker Engine & CLI
		- [x] Troubleshoot Docker's `apt` repo (`trixie Release` file does not exist, check guide?)
	- [x] Docker Compose
- [x] Set up Pi-hole as a container
- [ ] Set up Nginx
- [ ] Set up CouchDb (for obsidian notes hosting)
- [ ] Set up [uptime-kuma](https://github.com/louislam/uptime-kuma)
- [ ] Finish documentation

# Resources
- Here's an excellent [YouTube video](https://www.youtube.com/watch?v=FnFtWsZ8IP0) on setting up Pi-hole as a [Recursive DNS](https://www.geeksforgeeks.org/ethical-hacking/what-is-recursive-dns/) Server.
	- This is also excellent to combat against [DNS Spoofing](https://www.cloudflare.com/en-ca/learning/dns/dns-cache-poisoning/).

Further reading:
- https://peppe8o.com/install-raspberry-pi-os-lite-in-your-raspberry-pi/ 
- https://peppe8o.com/raspberry-pi-remote-management-and-access-tools/
- https://peppe8o.com/how-to-add-2-factor-authentication-2fa-in-raspberry-pi-os-lite-with-google-authenticator-for-ssh-login/
- https://peppe8o.com/fix-slow-ssh-remote-terminal-issue-in-raspberry-pi-os/
- https://raspberrypi-guide.github.io/networking/connecting-via-ssh
- 