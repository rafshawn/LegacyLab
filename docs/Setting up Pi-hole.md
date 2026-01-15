---
tags:
  - RaspberryPi
  - Homelab
created: 2026-01-03
categories:
  - Homelab
---
# What is [Pi-hole](https://pi-hole.net/)
- Pi-hole is a DNS sinkhole that allows you to block ads, security threats, trackers, etc. (bad traffic).
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