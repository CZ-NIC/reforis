/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

export function regionAndTime() {
    return {
        city: "Prague",
        country: "CZ",
        region: "Europe",
        time_settings: {
            how_to_set_time: "ntp",
            ntp_servers: [
                "217.31.202.100",
                "195.113.144.201",
                "195.113.144.238",
                "2001:1488:ffff::100",
                "ntp.nic.cz",
                "0.openwrt.pool.ntp.org",
                "1.openwrt.pool.ntp.org",
                "2.openwrt.pool.ntp.org",
                "3.openwrt.pool.ntp.org",
            ],
            time: "2019-04-24T21:15:03.661918",
        },
        timezone: "CET-1CEST,M3.5.0,M10.5.0/3",
    };
}
