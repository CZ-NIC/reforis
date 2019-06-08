/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

const API_URL_PREFIX = '/api';

const API_URLs = new Proxy({
        notifications: '/notifications',
        notificationsSettings: '/notifications-settings',

        // Network
        wifi: '/wifi',
        wan: '/wan',
        lan: '/lan',
        dns: '/dns',
        interfaces: '/interfaces',
        guestNetwork: '/guest-network',

        connectionTest: '/connection-test',
        dnsTest: '/dns-test',

        // Administration
        password: '/password',
        regionAndTime: '/region-and-time',
        time: '/time',
        approvals: '/approvals',
        updates: '/updates',
        packages: '/packages',
        reboot: '/reboot',

        healthCheck: '/health-check',
    },
    {
        get: (target, name) => {
            return `${API_URL_PREFIX}${target[name]}`
        }
    }
);

export default API_URLs;
