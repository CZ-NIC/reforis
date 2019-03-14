/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */


function ForisWS() {
    const protocol = window.location.protocol === "http:" ? "ws" : "wss";
    const url = protocol + "://" + window.location.hostname + ":" + ForisConstants.WSPort;

    this.ws = new WebSocket(url);
    this.callbacks = {  // callbacks[module][action]
        maintain: {
            'network-restart': []
        },
        router_notifications: {},
        updater: {},
    };

    this.ws.onmessage = (evt) => {
        console.log("Received Message: " + evt.data);
        var data = JSON.parse(evt.data);
        try {
            dispatch(data)
        } catch (e) {
            if (e instanceof TypeError) {
                console.log("Callback for this message wasn't found:" + evt.data);
            } else throw e;
        }
    };

    this.ws.onopen = () => {
        var output = JSON.stringify({"action": "subscribe", "params": Object.keys(this.callbacks)});
        this.ws.send(output);

        console.log("Connection open.");
    };

    this.ws.onclose = () => {
        console.log("Connection closed.");
    };

    this.bind = function (module, action, callback) {
        this.callbacks[module] = this.callbacks[module] || {};
        this.callbacks[module][action] = this.callbacks[module][action] || [];
        this.callbacks[module][action].push(callback);
        return this;
    };

    this.subscribe = function (params) {
        this.send("subscribe", params);
        return this;
    };

    this.send = function (action, params) {
        var payload = JSON.stringify({"action": action, "params": params});
        this.ws.send(payload);
        return this;
    };


    var dispatch = (json) => {
        if (!json.module) return;
        var chain = this.callbacks[json.module][json.action];
        if (typeof chain == 'undefined') return;
        for (var i = 0; i < chain.length; i++) {
            chain[i](json)
        }
    }
}

forisWS = new ForisWS();
