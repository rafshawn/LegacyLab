---
tags:
  - Networking
  - Pi-hole
created: 2026-01-18
updated:
categories:
  - Unfinished
---
DNS resolution is the process that translates human-readable domain names, like www.example.com, into machine-readable IP addresses, such as `192.0.2.1`. This is a process that allows users to access websites without needing to remember complex numerical addresses.

If you're looking to set up a secure local DNS resolver, see Unbound

Learning Resources:
- https://www.datadoghq.com/knowledge-center/dns-resolution/
- 

Public DNS Resolvers:
- Cloudflare [1.1.1.1](https://one.one.one.one/)
	- https://blog.cloudflare.com/introducing-1-1-1-1-for-families/
	- https://blog.cloudflare.com/announcing-1111/
- [OpenDNS](https://www.opendns.com/)
- Quad9 [9.9.9.9](https://quad9.net/)
	- Blocks lookups of malicious host names.
	- Protects computers, mobile devices, or IoT systems against:
		- Malware
		- Phishing
		- Spyware
		- Botnets
	- Can improve performance and guarantee privacy
	- Operated by Swiss based Quad9 Foundation
	- Privacy:
		- No data containing your IP address is ever logged in any Quad9 system.
		- The only large DNS resolver with a founding charter that includes privacy as a primary goal.

If you choose to stick with a large DNS resolver, I recommend using Quad9.