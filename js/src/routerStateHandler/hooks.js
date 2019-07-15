/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import {useEffect, useState} from 'react';

import {tryReconnect, waitForDown} from './utils';
import {ForisURLs} from '../common/constants';

export function useNetworkRestart(ws) {
    return useRouterState(ws, 'network-restart', window.location.pathname);
}

export function useReboot(ws) {
    return useRouterState(ws, 'reboot', ForisURLs.login);
}

export const STATES = {
    NOT_TRIGGERED: 0,
    TRIGGERED: 1,
    IN_PROCESS: 2,
    DONE: 3,
};

function useRouterState(ws, action, reconnectUrlPath) {
    const [state, setState] = useState(STATES.NOT_TRIGGERED);
    const [ips, setIPs] = useState([]);
    const [remainsSec, setRemainsSec] = useState(null);

    useEffect(() => {
        const wsModule = 'maintain';
        ws.subscribe(wsModule)
            .bind(wsModule, action, msg => {
                setIPs([...new Set(msg.data.ips)]);
                const remainsSec = msg.data.remains / 1000;
                setRemainsSec(remainsSec);
                setState(remainsSec === 0 ? STATES.IN_PROCESS : STATES.TRIGGERED);
            })
    }, [action, ws]);
    useEffect(() => {
        if (state === STATES.IN_PROCESS) {
            ws.close();
            waitForDown(() => setState(STATES.DONE));
        } else if (state === STATES.DONE) {
            tryReconnect(ips, reconnectUrlPath);
        }
    }, [ips, reconnectUrlPath, state, ws]);

    return [state, remainsSec];
}
