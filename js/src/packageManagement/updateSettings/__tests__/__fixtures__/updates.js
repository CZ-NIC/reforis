/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

export function updatesFixture() {
    return {
        approval_settings: {
            status: "on",
        },
        enabled: false,
        reboots: {
            delay: 4,
            time: "04:30",
        },
    };
}
