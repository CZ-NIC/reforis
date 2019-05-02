/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import axios from 'axios';

const POST_HEADERS = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

const TIMEOUT = 5000;

export default class API {
    constructor(url, endpoints) {
        this.url = url;
        for (let endpoint of Object.keys(endpoints)) {
            this[endpoint] = {};
            this.bindEndpoint(endpoints[endpoint]);
        }
    }

    bindEndpoint(endpoint) {
        const url = `${this.url}${endpoint.url}`;
        for (let method of endpoint.methods) {
            let functionToBind;
            switch (method) {
                case 'get':
                    functionToBind = (url_data) => {
                        return axios.get(url + (url_data ? url_data : ''), {
                            timeout: TIMEOUT
                        })
                            .then(response => response.data);
                    };
                    break;
                case 'post':
                    functionToBind = (data) => {
                        return axios.post(url, data, {
                            headers: POST_HEADERS,
                            timeout: TIMEOUT,
                        })
                            .then(response => response.data)
                    };
                    break;
            }
            this[endpoint.name][method] = functionToBind;
        }
    }
}