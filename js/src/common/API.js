/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import API from './APIUtils';

const API_URL = '/api';

export const APIEndpoints = {
    notifications: {
        name: 'notifications',
        url: '/notifications',
        methods: ['get', 'post']
    },
    notificationsSettings: {
        name: 'notificationsSettings',
        url: '/notifications-settings',
        methods: ['get', 'post']
    },
    wifi: {
        name: 'wifi',
        url: '/wifi',
        methods: ['get', 'post']
    },
    wan: {
        name: 'wan',
        url: '/wan',
        methods: ['get', 'post']
    },
    connectionTest: {
        name: 'connectionTest',
        url: '/connection-test',
        methods: ['get']
    },
    lan: {
        name: 'lan',
        url: '/lan',
        methods: ['get', 'post']
    },
    dns: {
        name: 'dns',
        url: '/dns',
        methods: ['get', 'post']
    },
    dnsTest: {
        name: 'dnsTest',
        url: '/dns-test',
        methods: ['get']
    },
    password: {
        name: 'password',
        url: '/password',
        methods: ['get', 'post']
    },
    regionAndTime: {
        name: 'regionAndTime',
        url: '/region-and-time',
        methods: ['get', 'post']
    },
    time: {
        name: 'time',
        url: '/time',
        methods: ['get']
    },
    updates: {
        name: 'updates',
        url: '/updates',
        methods: ['get', 'post']
    },
    approvals: {
        name: 'approvals',
        url: '/approvals',
        methods: ['get', 'post']
    },
    packages: {
        name: 'packages',
        url: '/packages',
        methods: ['get', 'post']
    },
    reboot: {
        name: 'reboot',
        url: '/reboot',
        methods: ['get']
    },
    healthCheck: {
        name: 'healthCheck',
        url: '/health-check',
        methods: ['get']
    },
};

export default new API(API_URL, APIEndpoints);
