/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

const API_URL = '/api';
const ENDPOINTS = [
    {name: 'wifi', url: '/wifi', methods: ['get', 'post']},
    {name: 'wan', url: '/wan', methods: ['get', 'post']},
    {name: 'notifications', url: '/notifications', methods: ['get', 'post']}
];

class API {
    constructor(url, endpoints) {
        this.url = url;
        for (let endpoint of endpoints) {
            this[endpoint.name] = {};

            for (let method of endpoint.methods) {
                this[endpoint.name][method] = wrapFetch(`${this.url}${endpoint.url}`, method)
            }
        }
    }
}

const POST_HEADERS = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

const wrapFetch = function (url, method) {
    switch (method) {
        case 'get':
            return () => {
                return fetch(url).then(response => response.json());
            };
        case 'post':
            return (data) => {
                return fetch(
                    url,
                    {
                        headers: POST_HEADERS,
                        method: 'POST',
                        body: JSON.stringify(data)
                    }
                ).then(response => response.json())
            };
    }
};

export const ForisAPI = new API(API_URL, ENDPOINTS);
