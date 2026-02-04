---
title: Blocklists
tags:
  - Networking
  - Pi-hole
created: 2026-02-04
updated:
categories:
  - Unfinished
---
# Adding Blocklists
On the dashboard sidebar, navigate to lists. If you have the link to a subscribed list, simply paste it to the Address form and add it to allowlist.

It describes to you how to apply them in the hints section. You can either run `pihole -g` on the CLI or update the gravity list by navigating to `System/Tools/Update Gravity` on the sidebar.

# Recommended Blocklists
Here's some blocklists I recommend
- [Hagezi's DNS Blocklists](https://github.com/hagezi/dns-blocklists)
	- [Multi PRO](https://github.com/hagezi/dns-blocklists?tab=readme-ov-file#pro) - Extended protection
	- [Threat Intelligence Feeds](https://github.com/hagezi/dns-blocklists?tab=readme-ov-file#tif) - Block Malware, Cryptojacking, Scam, Spam, and Phishing
	- [Native Trackers](https://github.com/hagezi/dns-blocklists?tab=readme-ov-file#calling-native-tracker---broadband-tracker-of-devices-services-and-operating-systems-) (Optional) - Block native broadband tracker that monitor user activity on your specific device.
		- This is already part of all the main lists, but you can look through this list if you want more privacy/tracker protection.
		- Anything above Pro may affect negatively affect functionality/limit features.

Here are some other blocklists to look at
- https://github.com/r0xd4n3t/pihole-adblock-lists?tab=readme-ov-file
- https://github.com/Perflyst/PiHoleBlocklist?tab=readme-ov-file

Other blocklist resources:
- https://www.reddit.com/r/pihole/comments/ovw81t/i_found_a_blocklist_that_blocks_99_of_the_ads_on/
- https://gist.github.com/hkamran80/779019103fcd306979411d44c8d38459
- https://www.reddit.com/r/pihole/comments/1n0ymme/samsung_blocklist/
- https://www.rahulpandit.com/post/good-pi-hole-blocklists-that-stop-online-ads-trackers-and-malware/
- https://www.rahulpandit.com/post/free-third-party-dns-for-blocking-ads-and-trackers/

Blocking Ads on Disney Plus
- Add a regex deny rule for `diproton-ads-[^\.]*\.hulu\.com\.akadns\.net`
- 