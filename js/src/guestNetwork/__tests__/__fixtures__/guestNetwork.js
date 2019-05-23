/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

export default function guestNetworkFixture() {
    return {
        dhcp: {
            clients: [],
            enabled: false,
            lease_time: 3600,
            limit: 150,
            start: 100
        },
        enabled: false,
        interface_count: 2,
        interface_up_count: 0,
        ip: '10.111.222.1',
        netmask: '255.255.255.0',
        qos: {
            download: 1023,
            enabled: false,
            upload: 1025
        }
    }
}