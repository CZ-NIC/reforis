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

const FETCH_TIMEOUT = 5000;

export function fetchWithTimeout(url, options = null, timeout = FETCH_TIMEOUT) {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), timeout)
        )
    ]);
}


export default class API {
    constructor(url, endpoints) {
        this.url = url;
        for (let endpoint of endpoints) {
            this[endpoint.name] = {};
            this.bindEndpoint(endpoint);
        }
    }

    bindEndpoint(endpoint) {
        const url = `${this.url}${endpoint.url}`;
        for (let method of endpoint.methods) {
            let functionToBind;
            switch (method) {
                case 'get':
                    functionToBind = (url_data) => {
                        return fetchWithTimeout(url + (url_data ? url_data : ''))
                            .then(response => response.json());
                    };
                    break;
                case 'post':
                    functionToBind = (data) => {
                        return fetchWithTimeout(
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