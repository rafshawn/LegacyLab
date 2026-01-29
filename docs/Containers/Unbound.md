---
tags:
  - Networking
  - Pi-hole
created: 2026-01-22
updated:
categories:
  - Containers
  - Unfinished
---
## Extra Layer with [Unbound](https://www.nlnetlabs.nl/projects/unbound/about/)
- A recursive DNS server
- Rather than sending the DNS request to an upstream provider, unbound gets the answer on its own
	- i.e., Unbound stops relying on a third party
- You can enhance privacy by...
	- [DNS over TLS](https://developers.cloudflare.com/1.1.1.1/encryption/dns-over-tls/)
	- [DNS over HTTPS](https://developers.cloudflare.com/1.1.1.1/encryption/dns-over-https/)
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

Use Docker to run Unbound in a containerised environment. This should provide flexibility and isolation for DNS services.

# Unbound Containers
You don't have to package your own Unbound container (although you can if you want to or know how to).
Some recommended ones are:
- `MatthewVance/unbound-docker-rpi` ([repo](https://github.com/MatthewVance/unbound-docker-rpi))
	- (As of writing) Updated up to Unbound v1.22.0
	- [Someone opened a pull request to support v1.23.1](https://github.com/MatthewVance/unbound-docker-rpi/pull/60)
- `madnuttah/unbound-docker`([repo](https://github.com/madnuttah/unbound-docker))
	- A security-hardened, distroless Docker image that runs Unbound as a DNSSEC-validating recursive DNS resolver.
	- Designed for integration with Pi-hole and AdGuard Home.
	- Supports optional Redis caching for high-performance deployments.
	- More info:
		- The `Alpine-Linux Based ...` might throw some people off, but it's really just built using Alpine Linux.
			- The final runtime image contains only essential Unbound binaries and libraries copied from the build stage.
			- (see [Docker `scratch`](https://hub.docker.com/_/scratch))
		- Supports Linux-based 386, ARMv6, ARMv7, ARM64 and AMD64 platforms. ([see](https://github.com/madnuttah/unbound-docker/blob/main/doc/README.md#Installation))
- `klutchell/unbound-docker` ([repo](https://github.com/klutchell/unbound-docker))
	- This is the most popular image. It has 12M+ pulls.

I personally recommend `madnuttah`'s image if you want to set up unbound.
- [His post in Pi-hole discourse](https://discourse.pi-hole.net/t/distroless-alpine-linux-based-recursive-unbound-dns-resolver-docker-image/69038)
# Setting up Unbound
With Unbound set up on top of Pi-hole, your compose file should now look like this:
```zsh
services:
  pihole:
    container_name: pihole
    image: pihole/pihole:latest
    hostname: pihole
    domainname: legacylab.lan
    depends_on:
      - unbound
    cap_add:
      - NET_BIND_SERVICE
      # Uncomment if you are using Pi-hole as your DHCP server
      # - NET_ADMIN
    networks:
      - iot_bridge
    ports:
      # DNS Ports
      - "53:53/tcp"
      - "53:53/udp"
      # Default HTTP Port
      - "80:80/tcp"
      # Default HTTPs Port
      - "443:443/tcp"
    environment:
      TZ: ${TZ}
    FTLCONF_webserver_api_password: ${PIHOLE_PASSWORD}
      FTLCONF_dns_upstreams: 'unbound#5335'
      FTLCONF_dns_listeningMode: 'ALL'
    volumes:
      - './data/pihole:/etc/pihole'
    restart: unless-stopped

  unbound:
    container_name: unbound
    image: madnuttah/unbound:latest
    hostname: unbound
    domainname: legacylab.lan
    ports:
      - "5335:5335/tcp"
      - "5335:5335/udp"
    networks:
      - iot_bridge
    environment:
      TZ: 'America/Toronto'
      # Optional (Uncomment where needed)
      # UNBOUND_UID: 1000
      # UNBOUND_GID: 1000
      # HEALTHCHECK_PORT: 5335
      # EXTENDED_HEALTHCHECK: false
      # EXTENDED_HEALTHCHECK_DOMAIN: <Domain/host to query>
      # ENABLE_STATS: false
    volumes:
	  - './data/unbound/unbound.conf:/usr/local/unbound/unbound.conf'
      # - ./conf.d/:/usr/local/unbound/conf.d/:rw
      # - ./log.d/unbound.log:/usr/local/unbound/log.d/unbound.log:rw
      # - ./zones.d/:/usr/local/unbound/zones.d/:rw
	restart: unless-stopped

  networks:
    iot_bridge:
      driver: bridge
```


## Default Setup
- Uses basic Docker networking with simple port mapping.
- Unbound runs on port 5335 and you expose it directly to you host network.
- This is the simplest configuration but offers limited isolation.

## Docker Compose Templates:
- [`docker-compose-bridge.yaml`](https://github.com/madnuttah/unbound-docker/blob/main/doc/examples/docker-compose-bridge.yaml): Recommended for most users - simple container-to-container communication.
- [`docker-compose-macvlan.yaml`](https://github.com/madnuttah/unbound-docker/blob/main/doc/examples/docker-compose-macvlan.yaml): Best network isolation - containers appear as separate network devices.
- [`docker-compose-madnuttah.yaml`](https://github.com/madnuttah/unbound-docker/blob/main/doc/examples/docker-compose-madnuttah.yaml): Author's production setup with Redis caching and monitoring.
	- Includes Redis CacheDB for performance optimisation, extended health checks, and proper service dependencies.
	- Demonstrates the full stack with Pi-hole, Unbound, Redis, and monitoring capabilities.
- [`docker-compose-minimal.yaml`](https://github.com/madnuttah/unbound-docker/blob/main/doc/examples/docker-compose-minimal.yaml): Basic testing template or starting point for custom setups.
	- The documentation recommends starting with this if you have trouble, then adding volumes incrementally.
## Bridge Network Setup
- The bridge network creates a custom Docker bridge network that allows containers to communicate directly while maintaining isolation from your host network.
- Key characteristics:
	- Container communication: Pi-hole and Unbound can communicate using container names as DNS hostnames
	- Static IPs: Both containers get assigned static IPs on the bridge network.
	- Port Mapping: Only necessary ports are exposed to the host.
	- Simplicity: Easier to configure than MACVLAN while providing better isolation than default.
- The bridge configuration shows Pi-hole forwarding DNS queries to Unbound's bridge IP address on port 5335.
## MACVLAN Network Setup
- MACVLAN provides the most advanced networking by giving each container its own MAC address and IP address on your physical network.
- Key features:
	- Network Identity: Containers appear as separate physical devices on your network.
	- No NAT: Eliminates network address translation complexity.
	- Direct Access: Containers can be accessed directly from other network devices.
	- Additional ridge: Requires a shim bridge network for host-container communication.
- The MACVLAN setup is more complex, but provides better network visibility and isolation.
## Recommendation
- The documentation recommends the combined MACVLAN/Bridge approach for production use (other network configurations will also work).
- For most users, the bridge network setup provides the best balance of simplicity and functionality.

## 1. Preparing the environment
Create a directory where Unbound will store its config files. This is where we'll mount our docker container later to share configs between your host machine and the Unbound container.
```zsh
mkdir -p /opt/unbound/etc/unbound/
```
This command creates the `unbound` directory inside `opt`, which will house all Unbound-related configs.

# 2. Download the Unbound config file
Download the default unbound config file. This contains essential settings that allow the DNS resolver to function properly.

Navigate to the `unbound` directory and download the configuration:
```zsh
cd /opt/unbound/etc/unbound/
curl 
```

# Networking Approach
## Bridge Network
(Simple container-to-container communication)

The bridge setup is recommended for most users. It creates a custom Docker bridge network that allows Pi-hole and Unbound to communicate using container names while maintaining isolation from your host network.

This provides good balance of simplicity and functionality.

- **Container Communication**: Pi-hole and Unbound can communicate using container names as DNS hostnames
- **Static IPs**: Both containers get assigned static IPs on the bridge network
- **Port Mapping**: Only necessary ports are exposed to the host
- **Simplicity**: Easier to configure than MACVLAN while providing better isolation than default

## MACVLAN Network
(Best network isolation - containers appear as separate network devices)

This provides the highest network security and isolation by giving each container its own MAC address and IP address on you physical network. The documentation prefers this approach, but notes that it's more complex and requires additional bridge network configuration for host communication.

- **Network Identity**: Containers appear as separate physical devices on your network
- **No NAT**: Eliminates network address translation complexity
- **Direct Access**: Containers can be accessed directly from other network devices
- **Additional Bridge**: Requires a shim bridge network for host-container communication

## Custom Configuration
(Basic testing template or starting point for custom setups)
See the file `docker-compose-minimal.yaml`

This file serves as a basic template for testing or as a starting point for custom configurations. The documentation recommends starting with this if you have trouble, then adding volumes incrementally.

# Validating Unbound is Working and Recursive
Run `nslookup` make sure everything works as it should.
```zsh
nslookup google.com <UNBOUND_IP>
```
- You should receive a response if it works. Remember to set the DNS server of your DHCP server to use the IP address of Pi-hole.
- This ensures everything is routed through Pi-hole and then sent to Unbound.
- Try having a second DNS server in case this goes offline.
- You can also validate that Unbound is acting as a recursive DNS server by running a [DNS leak test](https://www.dnsleaktest.com/).
	- Select the Extended Test
	- If the only result is your external IP address, Unbound is functioning properly

# Setting up the Config File
We want Unbound to function as a recursive DNS server. That means functioning locally only, no reaching out to upstream DNS servers.

Modify the `unbound.conf` file created in the `unbound` directory.

Remove the following lines:
```conf
#
# LOCAL ZONE
#

# Include ...
```

Modify the following interface line:
```conf
# Listen to for queries from clients and answer from this network interface
# and port.
interface: 0.0.0.0@53
```

Since we set the ports to `5335:5335`, we should modify it to be...
```conf
interface: 0.0.0.0@5335
```

Save and restart Unbound and Pi-hole. The Unbound IP address should be set as the upstream DNS server in Pi-hole. Check by logging in to the admin interface. Navigate to `Settings/DNS`.