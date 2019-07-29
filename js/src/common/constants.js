/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

export const REFORIS_PREFIX = process.env.LIGHTTPD ? '/reforis' : '';

export const ForisURLs = {
    login: `${REFORIS_PREFIX}/login`,
    static: `${REFORIS_PREFIX}/static/reforis`,
    wifi: `${REFORIS_PREFIX}/network-settings/wifi`,
    updates: `${REFORIS_PREFIX}/updates`,

    // Notifications links are used with <Link/> inside Router, thus url subdir is not required.
    notifications: `/notifications`,
    notificationsSettings: `/administration/notifications-settings`,

    luci: '/cgi-bin/luci',
};
