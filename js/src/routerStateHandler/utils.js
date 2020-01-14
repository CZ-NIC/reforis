/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import axios from "axios";

import API_URLs from "common/API";

const HEALTH_CHECK_TIMEOUT = 500;
const HEALTH_CHECK_INTERVAL = 500;

const WAIT_FOR_DOWN_TIMEOUT = 3000;

const REQUEST_HEADERS = { "Content-Type": "application/json" };

// Waits until foris is down, then call callback
export function waitForDown(callback) {
    const polling = setInterval(poll, HEALTH_CHECK_INTERVAL);

    function stopPolling() {
        clearInterval(polling);
        callback();
    }

    function poll() {
        axios.get(API_URLs.healthCheck, {
            headers: REQUEST_HEADERS,
            timeout: HEALTH_CHECK_TIMEOUT,
        })
            .catch(stopPolling);
    }

    // When WAIT_FOR_DOWN_TIMEOUT is passed then it means that foris was down short time and we
    // and we doesn't noticed it. In this case we can stop polling.
    setTimeout(stopPolling, WAIT_FOR_DOWN_TIMEOUT);
}

export function tryReconnect(ips, reconnectUrlPath) {
    ips.forEach(async (ip) => {
        const port = window.location.port === "" ? "" : `:${window.location.port}`;
        const { protocol } = window.location;
        const baseURL = `${protocol}//${ip}${port}`;
        const callback = () => window.location.replace(`${baseURL}${reconnectUrlPath}`);
        waitForUpPolling(`${baseURL}${API_URLs.healthCheck}`, callback);
    });
}

// Waits until foris is up, then call callback
function waitForUpPolling(url, callback) {
    const polling = setInterval(poll, HEALTH_CHECK_INTERVAL);

    function stopPolling() {
        clearInterval(polling);
        callback();
    }

    function poll() {
        axios.get(url, {
            headers: REQUEST_HEADERS,
            timeout: HEALTH_CHECK_TIMEOUT,
        })
            .then(stopPolling);
    }
}
