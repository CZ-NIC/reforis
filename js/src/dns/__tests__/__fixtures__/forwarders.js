/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

export const forwardersFixture = {
    forwarders: [
        {
            description: "Google",
            editable: false,
            ipaddresses: {
                ipv4: "8.8.8.8",
                ipv6: "2001:4860:4860::8888",
            },
            name: "99_google",
            tls_hostname: "",
            tls_pin: "",
            tls_type: "no",
        },
        {
            description: "Custom forwarder",
            editable: true,
            ipaddresses: {
                ipv4: "1.2.3.4",
            },
            name: "custom_fwd",
            tls_hostname: "dns.custom.net",
            tls_type: "hostname",
        },
        {
            description: "CZ.NIC (TLS)",
            editable: false,
            ipaddresses: {
                ipv4: "193.17.47.1",
                ipv6: "2001:148f:ffff::1",
            },
            name: "00_odvr-cznic",
            tls_hostname: "odvr.nic.cz",
            tls_pin: "",
            tls_type: "hostname",
        },
        {
            description: "Cloudflare (TLS)",
            editable: false,
            ipaddresses: {
                ipv4: "1.1.1.1",
                ipv6: "2606:4700:4700::1111",
            },
            name: "99_cloudflare",
            tls_hostname: "cloudflare-dns.com",
            tls_pin: "",
            tls_type: "hostname",
        },
    ],
};
