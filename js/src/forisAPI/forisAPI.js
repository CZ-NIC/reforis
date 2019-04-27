/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import API from './utils';

const API_URL = '/api';
const ENDPOINTS = [
    {name: 'notifications', url: '/notifications', methods: ['get', 'post']},
    // Notifications settings has snack case because of having same name as WS module.
    {name: 'router_notifications', url: '/notifications-settings', methods: ['get', 'post']},
    {name: 'wifi', url: '/wifi', methods: ['get', 'post']},
    {name: 'wan', url: '/wan', methods: ['get', 'post']},
    {name: 'lan', url: '/lan', methods: ['get', 'post']},
    {name: 'dns', url: '/dns', methods: ['get', 'post']},
    {name: 'connectionTest', url: '/connection-test', methods: ['get']},
    {name: 'password', url: '/password', methods: ['get', 'post']},
    {name: 'regionAndTime', url: '/region-and-time', methods: ['get', 'post']},
    {name: 'time', url: '/time', methods: ['get']},
    {name: 'updates', url: '/updates', methods: ['get', 'post']},
    {name: 'packages', url: '/packages', methods: ['get', 'post']},
    {name: 'reboot', url: '/reboot', methods: ['get']},
    {name: 'healthCheck', url: '/health-check', methods: ['get']},
];

const ForisAPI = new API(API_URL, ENDPOINTS);
export default ForisAPI;
