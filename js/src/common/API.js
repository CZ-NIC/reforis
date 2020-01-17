/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import { REFORIS_URL_PREFIX } from "foris";

const API_URL_PREFIX = `${REFORIS_URL_PREFIX}/api`;

const API_URLs = new Proxy({
    notifications: "/notifications",
    notificationsSettings: "/notifications-settings",

    language: "/language",
    languages: "/languages",

    // Network
    wifi: "/wifi",
    wifiReset: "/wifi-reset",
    wan: "/wan",
    lan: "/lan",
    interfaces: "/interfaces",
    guestNetwork: "/guest-network",

    dns: "/dns",
    dnsForwarders: "/dns/forwarders",

    connectionTest: "/connection-test",
    dnsTest: "/dns/test",

    // Administration
    password: "/password",
    regionAndTime: "/region-and-time",
    ntpUpdate: "/ntp-update",
    approvals: "/approvals",
    updates: "/updates",
    runUpdates: "/updates/run",
    updatesStatus: "/updates/status",
    packages: "/packages",
    reboot: "/reboot",

    about: "/about",

    healthCheck: "/health-check",

    guide: "/guide",
    finishGuide: "/finish-guide",
    guideWorkflow: "/guide-workflow",

    controllerID: "/controller_id",
},
{
    get: (target, name) => `${API_URL_PREFIX}${target[name]}`,
});

export default API_URLs;
