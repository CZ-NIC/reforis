/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import {useEffect, useState} from 'react';

import {fetchWithTimeout} from '../../forisAPI/utils';
import {ForisPort, ForisProtocol} from '../../constants';

export const REBOOT_STATES = {
    NOT_TRIGGERED: 0,
    TRIGGERED: 1,
    IN_PROCESS: 2,
    DONE: 3,
};

const HEALTH_CHECK_URL = '/api/health-check';
const HEALTH_CHECK_TIMEOUT = 5000;

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
};

export default function useRebootHandling(ws) {
    const [state, setState] = useState(REBOOT_STATES.NOT_TRIGGERED);
    const [ips, setIPs] = useState([]);
    const [remainsSec, setRemainsSec] = useState(null);

    useEffect(() => {
        const wsModule = 'maintain';
        ws.subscribe(wsModule)
            .bind(wsModule, 'reboot', msg => {
                setRemainsSec(msg.data.remains / 1000);
                if (msg.data.remains === 0) {
                    setState(REBOOT_STATES.IN_PROCESS);
                } else {
                    setIPs([...new Set(msg.data.ips)]);
                    setState(REBOOT_STATES.TRIGGERED);
                }
            })
    }, []);

    useEffect(() => {
        if (state === REBOOT_STATES.IN_PROCESS) {
            ws.ws.close();
            waitForDeath();
        } else if (state === REBOOT_STATES.DONE) {
            tryReconnect();
        }
    }, [state]);

    function waitForDeath() {
        fetchWithTimeout(HEALTH_CHECK_URL, undefined, HEALTH_CHECK_TIMEOUT)
            .then(async () => {
                await sleep(1000);
                waitForDeath();
            })
            .catch((e) => {
                setState(REBOOT_STATES.DONE);
            })
    }

    function tryReconnect() {
        ips.forEach(async ip => {
            //TODO: PORT is not needed on prod.
            const url = `${ForisProtocol}://${ip}:${ForisPort}`;
            waitForLife(url);
        });
    }

    function waitForLife(url) {
        fetchWithTimeout(`${url}${HEALTH_CHECK_URL}`, {}, HEALTH_CHECK_TIMEOUT)
            .then(() => {
                window.location.replace(url);
            })
            .catch((e) => {
                waitForLife(url);
            });
    }

    return [state, remainsSec];
}
