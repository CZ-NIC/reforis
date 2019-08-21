/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import { useEffect, useState } from "react";

import { ForisURLs } from "common/constants";
import useWSForisModule from "common/WebSocketsHooks";

import { tryReconnect, waitForDown } from "./utils";

export function useNetworkRestart(ws) {
    return useDeviceState(ws, "network-restart", window.location.pathname);
}

export function useReboot(ws) {
    return useDeviceState(ws, "reboot", ForisURLs.login);
}

export const STATES = {
    NOT_TRIGGERED: 0,
    TRIGGERED: 1,
    IN_PROGRESS: 2,
    DONE: 3,
};

function useDeviceState(ws, action, reconnectUrlPath) {
    const [state, setState] = useState(STATES.NOT_TRIGGERED);
    const [ips, setIPs] = useState([]);
    const [remainsSec, setRemainsSec] = useState(null);
    const [wsData] = useWSForisModule(ws, "maintain", action);

    useEffect(() => {
        if (!wsData) return;
        setIPs([...new Set(wsData.ips)]);
        setRemainsSec(wsData.remains / 1000);
        setState(wsData.remains === 0 ? STATES.IN_PROGRESS : STATES.TRIGGERED);
    }, [wsData]);

    useEffect(() => {
        if (state === STATES.IN_PROGRESS) {
            ws.close();
            waitForDown(() => setState(STATES.DONE));
        } else if (state === STATES.DONE) {
            tryReconnect(ips, reconnectUrlPath);
        }
    }, [state, ips, reconnectUrlPath, ws]);

    return [state, remainsSec];
}
