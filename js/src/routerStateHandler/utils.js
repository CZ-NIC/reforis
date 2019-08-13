/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import axios from 'axios';

import API_URLs from 'common/API';

const HEALTH_CHECK_TIMEOUT = 1000;
const HEALTH_CHECK_INTERVAL = 1000;
const REQUEST_HEADERS = {'Content-Type': 'application/json',};

export function waitForDown(callback) {
    waitForDownPolling().then(() => callback());
}

function waitForDownPolling() {
    const poll = resolve => {
        axios.get(API_URLs.healthCheck, {
            headers: REQUEST_HEADERS,
            timeout: HEALTH_CHECK_TIMEOUT,
        })
            .then(() => setTimeout(poll, HEALTH_CHECK_INTERVAL, resolve))
            .catch(() => resolve());
    };
    return new Promise(poll);
}

export function tryReconnect(ips, reconnectUrlPath) {
    ips.forEach(async ip => {
        const port = window.location.port === '' ? '' : ':' + window.location.port;
        const protocol = window.location.protocol;
        const baseURL = `${protocol}//${ip}${port}`;
        waitForUpPolling(`${baseURL}${API_URLs.healthCheck}`)
            .then(() => window.location.replace(`${baseURL}${reconnectUrlPath}`));
    });
}

function waitForUpPolling(url) {
    const poll = resolve => {
        axios.get(url, {
            headers: REQUEST_HEADERS,
            timeout: HEALTH_CHECK_TIMEOUT,
        })
            .then(() => resolve())
            .catch(() => setTimeout(poll, HEALTH_CHECK_INTERVAL, resolve));
    };
    return new Promise(poll);
}
