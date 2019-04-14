/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

const POST_HEADERS = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};


export default class API {
    constructor(url, endpoints) {
        this.url = url;
        for (let endpoint of endpoints) {
            this[endpoint.name] = {};
            this.bindEnpoint(endpoint);
        }
    }

    bindEnpoint(endpoint) {
        const url = `${this.url}${endpoint.url}`;
        for (let method of endpoint.methods) {
            let functionToBind;
            switch (method) {
                case 'get':
                    functionToBind = (url_data) => {
                        return fetch(url + (url_data ? url_data : ''))
                            .then(response => response.json());
                    };
                    break;
                case 'post':
                    functionToBind = (data) => {
                        return fetch(
                            url,
                            {
                                headers: POST_HEADERS,
                                method: 'POST',
                                body: JSON.stringify(data)
                            }
                        ).then(response => response.json())
                    };
                    break;
            }
            this[endpoint.name][method] = functionToBind;
        }
    }
}