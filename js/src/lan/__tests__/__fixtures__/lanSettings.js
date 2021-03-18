/*
 * Copyright (C) 2019-2021 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

const lanSettingsFixture = {
    interface_count: 5,
    interface_up_count: 0,
    mode: "unmanaged",
    mode_managed: {
        dhcp: {
            clients: [
                {
                    active: true,
                    expires: 1616115143,
                    hostname: "test-client",
                    ip: "192.168.1.10",
                    mac: "8F:31:22:89:64:20",
                },
            ],
            enabled: false,
            ipv6clients: [
                {
                    active: false,
                    duid: "00098f65rfcee3bndu5221d7e7i743a46546p",
                    expires: 1616115144,
                    hostname: "test-client-2",
                    ipv6: "7b00:ce2:a17:41f3::w94",
                },
            ],
            lease_time: 43200,
            limit: 150,
            start: "192.168.1.10",
        },
        netmask: "255.255.255.0",
        router_ip: "192.168.1.4",
    },
    mode_unmanaged: {
        lan_dhcp: {},
        lan_static: {
            gateway: "192.168.1.4",
            ip: "192.168.1.4",
            netmask: "255.255.255.0",
        },
        lan_type: "dhcp",
    },
};

const lanCustomSettingsFixture = {
    interface_count: 5,
    interface_up_count: 0,
    lan_redirect: true,
    mode: "managed",
    mode_managed: {
        dhcp: {
            clients: [],
            enabled: false,
            ipv6clients: [],
            lease_time: 43200,
            limit: 150,
            start: "192.168.1.10",
        },
        netmask: "255.255.255.0",
        router_ip: "192.168.1.4",
    },
};

export { lanSettingsFixture, lanCustomSettingsFixture };
