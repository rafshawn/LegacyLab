---
tags:
  - Homelab
  - RaspberryPi
created: 2026-01-13
updated: 2026-01-13
categories:
  - Homelab
---
- Must have home server services 2025 ([article](https://techhut.tv/must-have-home-server-services-2025))
# Dashboard
- Heimdall
- Homearr
- [Glance](https://github.com/glanceapp/glance): Widget-based dashboard
	- Monitor online/offline services
	- DNS stats
	- 
# Tools & Services
- [log2ram](https://github.com/azlux/log2ram): helps preserve the life of your sd card basically
	- Using Log2RAM on the Raspberry Pi ([article](https://pimylifeup.com/raspberry-pi-log2ram/))
	- Save your SD Card ([article](https://raspberrytips.com/install-log2ram-raspberry-pi/))
	- How to Write Log Files in Ram using Log2RAM in Linux ([article](https://itsfoss.gitlab.io/post/how-to-write-log-files-in-ram-using-log2ram-in-linux/))
	- Optimizing Performance with Raspberry Pi Log2RAM ([article](https://fleetstack.io/blog/raspberry-pi-log2ram-guide))
	- DietPi has Log2RAM pre-installed and pre-configured.
- [iSponsorBlockTV](https://github.com/dmunozv04/iSponsorBlockTV): Block or skip YouTube ads, intros, and sponsored segments.
	- Uses [SponsorBlock](https://sponsor.ajay.app/) API
- NginX: Proxy Manager
- [Pi-hole](https://pi-hole.net/): Network-Wide Ad Blocking
	- Optional: Install with only blocked queries logged (to review and whitelist as needed)
	- Blocklists:
		- [Hagezi Pro](https://github.com/hagezi/dns-blocklists#pro)
		- [Hagezi Threat Intelligence Feeds](https://github.com/hagezi/dns-blocklists?tab=readme-ov-file#tif)
		- Blocklist Discussion ([Reddit](https://www.reddit.com/r/pihole/comments/1ho2gao/what_adlists_are_mainly_used_these_days/?share_id=G8GozCY4rq0v5gy1BEV0f&utm_medium=ios_app&utm_name=ioscss&utm_source=share&utm_term=1))
		- Aggregated Blocklists ([repo](https://github.com/ph00lt0/blocklist))
- [Home Assistant](www.home-assistant.io): Open source home automation
	- [Setup guide](https://raspberrytips.com/home-assistant-raspberry-pi/#home-assistant-installation-with-docker)
- [Jellyfin](https://jellyfin.org/): Free Software Media System
- [Unbound](https://www.nlnetlabs.nl/projects/unbound/about/): DNS resolver
- [Tailscale](https://tailscale.com/):
	- Optional: For remote SSH access only (no exit node or subnet routing)