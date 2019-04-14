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
    {name: 'wifi', url: '/wifi', methods: ['get', 'post']},
    {name: 'wan', url: '/wan', methods: ['get', 'post']},
    {name: 'lan', url: '/lan', methods: ['get', 'post']},
    {name: 'connectionTest', url: '/connection-test', methods: ['get']},
];

const ForisAPI = new API(API_URL, ENDPOINTS);
export default ForisAPI;
