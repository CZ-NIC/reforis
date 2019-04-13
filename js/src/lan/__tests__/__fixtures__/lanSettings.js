/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

export function lanSettingsFixture() {
    return {
        interface_count: 5,
        interface_up_count: 0,
        mode: 'unmanaged',
        mode_managed: {
            dhcp: {
                clients: [],
                enabled: false,
                lease_time: 43200,
                limit: 150,
                start: 123123
            },
            netmask: '255.255.255.0',
            router_ip: '192.168.1.4'
        },
        mode_unmanaged: {
            lan_dhcp: {},
            lan_static: {
                gateway: '192.168.1.4',
                ip: '192.168.1.4',
                netmask: '255.255.255.0'
            },
            lan_type: 'dhcp'
        }
    }
}