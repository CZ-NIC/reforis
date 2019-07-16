/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

export const REFORIS_PREFIX = process.env.NODE_ENV === 'production' ? '/reforis' : '';

export const ForisURLs = {
    login: `${REFORIS_PREFIX}/login`,
    wifi: `${REFORIS_PREFIX}/network-settings/wifi`,
    notifications: `${REFORIS_PREFIX}/notifications`,
    notificationsSettings: `${REFORIS_PREFIX}/administration/notifications-settings`,
    updates: `${REFORIS_PREFIX}/updates`,
    static: `${REFORIS_PREFIX}/static/reforis`,
    luci: '/cgi-bin/luci',
};
