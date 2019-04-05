/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */
import React, {useEffect, useState} from 'react';

export function useWSNetworkRestart() {
    const [remindsToNWRestart, setRemindsToNWRestart] = useState(0);
    useEffect(() => {
        window.forisWS.bind('maintain', 'network-restart',
            (msg) => {
                setRemindsToNWRestart(msg.data.remains / 1000);
            });
    }, []);
    return remindsToNWRestart
}

export function useWS(module, action, callback) {
    useEffect(() => {
        window.forisWS
            .subscribe(module)
            .bind(module, action, data => callback(data));
    }, []);
}
