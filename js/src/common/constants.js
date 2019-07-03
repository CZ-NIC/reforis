/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

const REFORIS_PREFIX = process.env.NODE_ENV === 'production' ? '/reforis/' : '';

export const ForisURLs = {
    login: `${REFORIS_PREFIX}/login`,
    notifications: `${REFORIS_PREFIX}/notifications`,
    notificationsSettings: `${REFORIS_PREFIX}/notifications-settings`,
    updates: `${REFORIS_PREFIX}/updates`,
    luci: '/cgi-bin/luci',
};
