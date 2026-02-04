---
title: Pi-hole
tags:
  - Networking
  - Pi-hole
created: 2026-01-03
updated:
categories:
  - Containers
  - Unfinished
---
For this setup, we will be taking advantage of Pi-hole v6.
# What is Pi-hole
- [Pi-hole](https://pi-hole.net/) is a DNS sinkhole that lets you block ads, security threats, trackers, etc. (i.e., bad traffic)
- Automatically filter requests and block specific ad-domains based on DNS resolution.
- After blocking bad traffic, it forwards good traffic to an upstream DNS provider.
	- Common options: Google or CloudFlare
- Client -> Pi-hole -> Upstream DNS
	- Pi-hole brokers the DNS connection
- The problem is that this system sends the information to a third party that is actively aware which DNS queries came from a specific IP address

## Will Having This Set-up Slow Internet?
- The biggest concern is potential network congestion.
- Having this setup shouldn't inherently slow down internet/bandwidth speed.
	- This is because it primarily handles DNS queries
	- i.e., only a small part of overall network traffic
- However misconfiguring it or routing all traffic through it may cause network congestion.

| Factor             | Pi-hole  | Pi-hole + Unbound |
| ------------------ | -------- | ----------------- |
| Ad Blocking        | Yes      | Yes               |
| DNS Caching        | Limited  | Extensive         |
| Network Congestion | Minimal  | Minimal           |
| Privacy Level      | Moderate | High              |
# Adguard Home
- See [AGH vs. Pi-hole](https://github.com/AdguardTeam/AdGuardHome#comparison-pi-hole)

# Setting up Pi-hole
Start by creating a directory to store the config file for the Pi-hole docker container
```zsh
sudo mkdir -p /opt/legacylab/data/pihole
cd /opt/legacylab/data/pihole
```

Now create a `compose.yaml` file to define the docker containers and options to pass onto them.

```zsh
sudo nano compose.yaml
```

Here's a compose file as a template:
```zsh
services:
  pihole:
    container_name: pihole
    image: pihole/pihole:latest
    hostname: LegacyLab
    domainname: legacylab.lan
    cap_add:
      - NET_BIND_SERVICE
      # Uncomment if you are using Pi-hole as your DHCP server
      # - NET_ADMIN
    ports:
      # DNS Ports
      - "53:53/tcp"
      - "53:53/udp"
      # Default HTTP Port
      - "80:80/tcp"
      # Default HTTPs Port
      - "443:443/tcp"
      # Uncomment if you are using Pi-hole as your DHCP server
      # - "67:67/udp"
    environment:
      TZ: ${TZ}
      FTLCONF_webserver_api_password: ${PIHOLE_PASSWORD}
      FTLCONF_dns_listeningMode: 'ALL'
    volumes:
      - './data/pihole:/etc/pihole'
    restart: unless-stopped
```
(You can also use Pi-hole's official [Docker Compose Template](https://docs.pi-hole.net/docker/) to understand its contents and capabilities)

Run
```zsh
docker compose up -d
```

You should be able to access Pi-hole's web interface with your local IP address. If you don't remember what it is, you can either run `hostname -I` on the Pi's terminal or `ping raspberrypi.local` on your computer if it's connected to the same network as the Pi.

Alternatively, you can also type `ifconfig` and look for `eth0`. Your IP address should be labeled under `inet` (so something like `inet 123.45.67.89)

Web dashboard address
```
https://<IP-address>/admin
```

If you changed the port away from 443, you'd need to define it to access the dashboard
```zsh
https://<IP-address>:<port>/admin
```

# Setting up Pi-hole
Detailed set up instructions ([here](https://discourse.pi-hole.net/t/how-do-i-configure-my-devices-to-use-pi-hole-as-their-dns-server/245))

1. Method A: The "Lone DNS" (DHCP Advertisement)

Go into your router's DHCP settings and change the primary DNS to the Pi's IP (e.g., `192.168.0.1`). 

If a secondary DNS is set, remove this (or set it to `0.0.0.0`).
# Accessing Pi-hole from outside your network

# `pihole-FTL`
Pi-hole "Faster-Than-Light" ...

# Other (TODO)
If you're curious about DNS query record types, check this: https://en.wikipedia.org/wiki/List_of_DNS_record_types

Further reading:
- https://www.reddit.com/r/pihole/comments/18unnwo/disable_router_dhcp_server_to_use_pihole/
- https://discourse.pi-hole.net/t/possible-nameserver-issues-pihole-v5-18-3-on-ubuntu-running-docker/76975/5
- 