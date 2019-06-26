/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import {ForisURLs} from './constants';

const PROTOCOL = window.location.protocol === 'http:' ? 'ws' : 'wss';

const URL = process.env.NODE_ENV === 'production' ?
    PROTOCOL + '://' + window.location.hostname + '/foris-ws' :
    PROTOCOL + '://' + window.location.hostname + ':' + 9081;

const WAITING_FOR_CONNECTION_TIMEOUT = 500;

export default class WebSockets {
    constructor() {
        this.ws = new WebSocket(URL);
        this.ws.onerror = e => {
            if (window.location.pathname !== ForisURLs.login) {
                console.error("WS: Error observed, you aren't logged probably.");
                window.location.replace(ForisURLs.login);
            }
            console.log(`WS: Error: ${e.data}`);
        };
        this.ws.onmessage = e => {
            console.log(`WS: Received Message: ${e.data}`);
            const data = JSON.parse(e.data);
            this.dispatch(data)
        };
        this.ws.onopen = () => {
            console.log('WS: Connection open.');
        };
        this.ws.onclose = () => {
            console.log('WS: Connection closed.');
        };

        // callbacks[module][action]
        this.callbacks = {};
    }

    waitForConnection(callback) {
        if (this.ws.readyState === 1) {
            callback();
        } else {
            const that = this;
            setTimeout(function () {
                that.waitForConnection(callback);
            }, WAITING_FOR_CONNECTION_TIMEOUT);
        }
    };

    bind(module, action, callback) {
        this.callbacks[module] = this.callbacks[module] || {};
        this.callbacks[module][action] = this.callbacks[module][action] || [];
        this.callbacks[module][action].push(callback);
        return this;
    };

    subscribe(params) {
        this.waitForConnection(() => {
            this.send('subscribe', params);
        });
        return this;
    };

    send(action, params) {
        const payload = JSON.stringify({action: action, params: params});
        this.waitForConnection(() => {
            this.ws.send(payload);
        });
        return this;
    };

    dispatch(json) {
        if (!json.module) return;

        let chain;
        try {
            chain = this.callbacks[json.module][json.action];
        } catch (e) {
            if (e instanceof TypeError) {
                console.log('Callback for this message wasn\'t found:' + e.data);
            } else throw e;
        }

        if (typeof chain == 'undefined') return;

        for (let i = 0; i < chain.length; i++)
            chain[i](json)
    }

    close() {
        this.ws.close();
    }
}
