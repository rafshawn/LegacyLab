---
tags:
  - Networking
  - Pi-hole
created: 2026-01-16
updated:
categories:
  - Unfinished
---

If you go through your dashboard, chances are that you'll find that `mask.icloud.com` and `mask-h2.icloud.com` are blocked by default.

- iCloud Private Relay
	- You can enable this if you have iCloud+
	- As apple best describes it, your DNS records and IP address can be seen by your network provider to build a profile based on your browsing habits.
	- iCloud Private Relay is meant to send your requests to two separate, secure internet relays.
		- First relay: (operated by apple) your IP is visible to your ISP and first relay. Your DNS records are encrypted, so neither party can see the address you're visiting.
		- Second relay: (operated by a third party content provider) this relay generates a temp IP address, decrypts the website address, and connects you to the site.
	- The idea is for neither apple nor your ISP to see who you are and what websites you are visiting.
	- 
	- More info on [iCloud Private Relay](https://support.apple.com/en-us/102602)
	- [Managing iCloud Private Relay](https://support.apple.com/en-ca/102022)

This is generally a good service, but it just straight up bypasses Pi-hole for DNS.

- Private relay bypasses Pi-hole for DNS.
	- i.e., devices will no longer be using Pi-hole.
	- Everything is allowed, regardless of your blocklist.
	- Alternatively, Unbound may be the best choice to get the most out of Pi-hole (from a privacy point of view)

On a more technical note, iCloud Private Relay is basically Apple's implementation of [oDoH](https://en.wikipedia.org/wiki/DNS_over_HTTPS#Oblivious_DNS_over_HTTPS).
- The idea is that you'll be using a proxy server (relay) to avoid the destination (DoH server) knowing who the request is coming from.
- ~~Some users argue that despite the privacy claims, it's still Apple managing your network requests, so essentially they're the ones collecting info on you.~~

As per Apple's guidance, you can block private relays by creating 2 specific DNS entries for the domains.
```
mask.icloud.com
mask-h2.icloud.com
```
Create a file `/etc/dnsmasq.d/xx-NXDOMAIN.conf`, replace `xx` with an unused number. Add this to the file:
```
server=/mask.icloud.com/
server=/mask-h2.icloud.com/
```
Restart Pi-hole.
This will ensure the reply to dig `mask.icloud.com` is NXDOMAIN. The dig is used to find a geographically localized relay address. If there's no address in the reply, the apple device will not use any relays.

From apple:
> The fastest and most reliable way to alert users is to return a negative answer from your network's DNS resolver, preventing DNS resolution for the following hostnames used by Private Relay traffic. Avoid causing DNS resolution timeouts or silently dropping IP packets sent to the Private Relay server, as this can lead to delays on client devices.

Interesting article: [*How does Apple Private Relay work?*](https://matduggan.com/how-does-apple-private-relay-work/)
- Basically Apple pings a specific domain. If it's blocked, it respects the Pi-hole config and won't turn on Private Relay. 
- Private relay only covers Safari and downloading attachments in Mail. It does not cover other apps.
- Network providers can also opt out of allowing Private Relay on their networks by blocking certain domain names. 
- I.e., [it is not a system-wide relay](https://nordvpn.com/blog/icloud-private-relay-vs-vpn/).

Further reading:
- https://github.com/oneoffdallas/dohservers/issues/20
- https://developer.apple.com/icloud/prepare-your-network-for-icloud-private-relay/
- https://discourse.pi-hole.net/t/icloud-private-relay/49811/10
- https://docs.pi-hole.net/ftldns/configfile/?h=mask#icloudprivaterelay
- https://www.reddit.com/r/pihole/comments/1avojcq/maskicloudcom_and_my_iphone/
- https://discussions.apple.com/thread/254446939?sortBy=rank
- https://www.reddit.com/r/pihole/comments/1i5ja02/apples_private_relay_question/
- https://www.reddit.com/r/pihole/comments/1lrmga0/iphone_somehow_bypasses_blocked_domains_even/
- https://www.reddit.com/r/Adguard/comments/1pa41t9/ios_private_relay_warnings/
- https://www.reddit.com/r/pihole/comments/1nt6h5u/allow_maskicloudcom_always_blocked/
- https://discourse.pi-hole.net/t/icloud-private-relay/49811/8
- 