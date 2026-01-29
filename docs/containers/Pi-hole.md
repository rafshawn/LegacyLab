---
tags:
  - RaspberryPi
  - Homelab
created: 2026-01-03
categories:
  - Homelab
---
# What is Pi-hole
- [Pi-hole](https://pi-hole.net/) is a DNS sinkhole that lets you block ads, security threats, trackers, etc. (i.e., bad traffic)
- Automatically filter requests and block specific ad-domains based on DNS resolution.
- After blocking bad traffic, it forwards good traffic to an upstream DNS provider.
	- Common options: Google or CloudFlare
- Client -> Pi-hole -> Upstream DNS
	- Pi-hole brokers the DNS connection
- The problem is that this system sends the information to a third party that is actively aware which DNS queries came from a specific IP address

## Extra Layer with [Unbound](https://www.nlnetlabs.nl/projects/unbound/about/)
- A recursive DNS server
- Rather than sending the DNS request to an upstream provider, unbound gets the answer on its own
	- i.e., Unbound stops relying on a third party
- You can enhance privacy by...
	- [DNS over TLS](https://developers.cloudflare.com/1.1.1.1/encryption/dns-over-tls/)
	- [DNS over HTTPS](https://developers.cloudflare.com/1.1.1.1/encryption/dns-over-tls/)
	- This encrypts the DNS query itself
	- Supported with Unbound
## Benefits of Using Unbound with Pi-hole
### Improved Performance:
- **Local DNS Caching:** Unbound caches DNS queries
	- Reduces the need to repeatedly query external DNS servers.
	- Can lead to faster response for frequently visited domains.
- **Direct Queries:** Skips unnecessary hops to third-party DNS servers
	- May potentially improve speed.
### Enhanced Privacy
- **No Third-party DNS:** Unbound = Rely less on third-party DNS = enhance privacy and security

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
sudo mkdir -p /opt/stacks/pihole
cd /opt/stacks/pihole
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
    ports:
      # DNS Ports
      - "53:53/tcp"
      - "53:53/udp"
      # Default HTTP Port
      - "80:80/tcp"
      # Default HTTPs Port
      - "443:443/tcp"
    environment:
      TZ: 'America/Toronto'
      FTLCONF_webserver_api_password: 'apple bottom jeans'
      FTLCONF_dns_listeningMode: 'ALL'
    volumes:
      - './etc-pihole:/etc/pihole'
    restart: unless-stopped
```

Run
```zsh
docker compose up -d
```

You should be able to access Pi-hole's web interface with your local IP address. If you don't remember what it is, you can either run `hostname -I` on the Pi's terminal or `ping raspberrypi.local` on your computer if it's connected to the same network as the Pi.

Web dashboard address
```
https://<IP-address>/admin
```

If you changed the port away from 443, you'd need to define it to access the dashboard
```zsh
https://<IP-address>:<port>/admin
```