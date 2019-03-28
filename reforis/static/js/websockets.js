/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */


function ForisWS() {
    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    const url = protocol + '://' + window.location.hostname + ':' + ForisConstants.WSPort;

    this.ws = new WebSocket(url);

    this.ws.onerror = (event) => {
        if (window.location.pathname !== '/login') {
            console.error("WebSocket error observed, you aren't logged probably...");
            window.location.replace('/login');
        }
    };

    // callbacks[module][action]
    this.callbacks = {
        maintain: {'network-restart': []},
        router_notifications: {},
        updater: {},
    };

    this.ws.onmessage = (evt) => {
        console.log('Received Message: ' + evt.data);
        const data = JSON.parse(evt.data);
        dispatch(data)
    };

    this.ws.onopen = () => {
        const output = JSON.stringify({action: 'subscribe', params: Object.keys(this.callbacks)});
        this.ws.send(output);
        console.log('WS connection open.');
    };

    this.ws.onclose = () => {
        console.log('WS connection closed.');
    };

    this.bind = function (module, action, callback) {
        this.callbacks[module] = this.callbacks[module] || {};
        this.callbacks[module][action] = this.callbacks[module][action] || [];
        this.callbacks[module][action].push(callback);
        return this;
    };

    this.subscribe = function (params) {
        this.send('subscribe', params);
        return this;
    };

    this.send = function (action, params) {
        const payload = JSON.stringify({action: action, params: params});
        this.ws.send(payload);
        return this;
    };


    const dispatch = (json) => {
        if (!json.module) return;

        let chain;
        try {
            chain = this.callbacks[json.module][json.action];
        } catch (e) {
            if (e instanceof TypeError) {
                console.log('Callback for this message wasn\'t found:' + evt.data);
            } else throw e;
        }

        if (typeof chain == 'undefined') return;

        for (let i = 0; i < chain.length; i++)
            chain[i](json)

    }
}

forisWS = new ForisWS();
