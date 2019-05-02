/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

const PROTOCOL = window.location.protocol === 'http:' ? 'ws' : 'wss';
const URL = PROTOCOL + '://' + window.location.hostname + ':' + ForisConstants.WSPort;

export default class WebSockets {
    constructor() {
        this.ws = new WebSocket(URL);
        this.ws.onerror = (event) => {
            if (window.location.pathname !== '/login') {
                console.error("WebSocket error observed, you aren't logged probably.");
                window.location.replace('/login');
            }
        };
        this.ws.onmessage = (evt) => {
            console.log('Received Message: ' + evt.data);
            const data = JSON.parse(evt.data);
            this.dispatch(data)
        };
        this.ws.onopen = () => {
            console.log('WS connection open.');
        };
        this.ws.onclose = () => {
            console.log('WS connection closed.');
        };

        // callbacks[module][action]
        this.callbacks = {};
    }

    bind(module, action, callback) {
        this.callbacks[module] = this.callbacks[module] || {};
        this.callbacks[module][action] = this.callbacks[module][action] || [];
        this.callbacks[module][action].push(callback);
        return this;
    };

    subscribe(params) {
        this.send('subscribe', params);
        return this;
    };

    send(action, params) {
        const payload = JSON.stringify({action: action, params: params});
        this.ws.send(payload);
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
}
