/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

export function wanSettingsFixture() {
    return {
        "interface_count": 1,
        "interface_up_count": 1,
        "last_seen_duid": "12345678d123d12345c4",
        "mac_settings": {
            "custom_mac_enabled": false
        },
        "proto": "dhcp",
        "up": true,
        "wan6_settings": {
            "wan6_type": "none"
        },
        "wan_settings": {
            "wan_dhcp": {},
            "wan_type": "dhcp"
        }
    }
}
