/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import axios from 'axios';

const HEALTH_CHECK_URL = '/api/health-check';
const HEALTH_CHECK_TIMEOUT = 5000;
const HEALTH_CHECK_INTERVAL = 1000;

export function waitForDown(callback) {
    waitForDownPolling().then(() => callback());
}

function waitForDownPolling() {
    const pool = resolve => {
        axios.get(HEALTH_CHECK_URL, {timeout: HEALTH_CHECK_TIMEOUT})
            .then(() => setTimeout(pool, HEALTH_CHECK_INTERVAL, resolve))
            .catch(() => resolve());
    };
    return new Promise(pool);
}

export function tryReconnect(ips, reconnectUrlPath) {
    ips.forEach(async ip => {
        //TODO: PORT is not needed on prod.
        const port = window.location.port === '' ? '' : ':' + window.location.port;
        const protocol = window.location.protocol;
        const baseURL = `${protocol}//${ip}${port}`;
        waitForUpPolling(`${baseURL}${HEALTH_CHECK_URL}`)
            .then(() => window.location.replace(`${baseURL}${reconnectUrlPath}`));
    });
}

function waitForUpPolling(url) {
    const pool = resolve => {
        axios.get(url, {timeout: HEALTH_CHECK_TIMEOUT})
            .then(() => resolve())
            .catch(() => setTimeout(pool, HEALTH_CHECK_INTERVAL, resolve));
    };
    return new Promise(pool);
}
