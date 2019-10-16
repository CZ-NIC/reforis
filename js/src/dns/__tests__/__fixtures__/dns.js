/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

export const dnsFixture = {
    available_forwarders: [
        {
            description: "",
            name: ""
        },
        {
            description: "Cloudflare (TLS)",
            name: "99_cloudflare"
        },
        {
            description: "Quad9 (TLS)",
            name: "99_quad9"
        },
        {
            description: "CZ.NIC (TLS)",
            name: "00_odvr-cznic"
        },
        {
            description: "Google",
            name: "99_google"
        }
    ],
    dns_from_dhcp_domain: "lan",
    dns_from_dhcp_enabled: false,
    dnssec_enabled: true,
    forwarder: "",
    forwarding_enabled: false
};

