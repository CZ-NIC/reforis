/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

const API_URL_PREFIX = process.env.NODE_ENV === 'production' ? '/reforis/api' : '/api';

const API_URLs = new Proxy({
        notifications: '/notifications',
        notificationsSettings: '/notifications-settings',

        language: '/language',
        languages: '/languages',

        // Network
        wifi: '/wifi',
        wifiReset: '/wifi-reset',
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
        ntpUpdate: '/ntp-update',
        approvals: '/approvals',
        updates: '/updates',
        packages: '/packages',
        reboot: '/reboot',

        healthCheck: '/health-check',

        guide: '/guide',
        finishGuide: '/finish-guide',
        guideWorkflow: '/guide-workflow',
    },
    {
        get: (target, name) => {
            return `${API_URL_PREFIX}${target[name]}`
        }
    }
);

export default API_URLs;
