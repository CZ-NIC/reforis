/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */


ForisWS = function () {
    const protocol = window.location.protocol === "http:" ? "ws" : "wss";
    const url = protocol + "://" + window.location.hostname + ":" + ForisConstants.WSPort;
    let ws = new WebSocket(url);

    // Module -> action
    let callbacks = {
        maintain: {
            'network-restart': [
                function (msg) {
                    console.log(msg.kind);
                    console.log(msg);
                }
            ]
        },
        router_notifications: {},
        updater: {},
    };

    ws.onmessage = function (evt) {
        console.log("Received Message: " + evt.data);
        try {
            dispatch(JSON.parse(evt.data))
        } catch (e) {
            if (e instanceof TypeError)
                console.log("Callback for this message wasn't found:" + evt.data);
            else throw e;
        }
    };

    ws.onopen = function () {
        var output = JSON.stringify({"action": "subscribe", "params": Object.keys(callbacks)});
        ws.send(output);
        console.log("Connection open.");
    };

    ws.onclose = function () {
        console.log("Connection closed.");
    };


    this.bind = function (module, action, callback) {
        callbacks[module] = callbacks[module] || {};
        callbacks[module][action] = callbacks[module][action] || [];
        callbacks[module][action].push(callback);
        return this;
    };

    this.send = function (event_name, event_data) {
        var payload = JSON.stringify({event: event_name, data: event_data});
        ws.send(payload);
        return this;
    };


    var dispatch = function (json) {
        var chain = callbacks[json.module][json.action];
        if (typeof chain == 'undefined') return;
        for (var i = 0; i < chain.length; i++) {
            chain[i](json.data)
        }
    }
};

forisWS = ForisWS();
