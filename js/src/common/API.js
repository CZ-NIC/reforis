/*
 * Copyright (C) 2020-2021 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import { REFORIS_URL_PREFIX } from "foris";

const API_URL_PREFIX = `${REFORIS_URL_PREFIX}/api`;

const API_URLs = new Proxy(
    {
        // Notifications
        notifications: "/notifications",
        notificationsSettings: "/notifications-settings",
        sendTestNotification: "/send-test-notification",

        // Languages
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
        reboot: "/reboot",
        hostname: "/system/hostname",

        // Updater
        approvals: "/approvals",
        updates: "/updates",
        runUpdates: "/updates/run",
        updatesRunning: "/updates/running",
        updatesEnabled: "/updates/enabled",
        packages: "/packages",
        languagePackages: "/language-packages",

        // Guide
        guide: "/guide",
        finishGuide: "/finish-guide",
        guideWorkflow: "/guide-workflow",

        // Other
        healthCheck: "/health-check",
        controllerID: "/controller_id",
        about: "/about",
    },
    {
        get: (target, name) => `${API_URL_PREFIX}${target[name]}`,
    }
);

export default API_URLs;

const API_URL_MODULES_PREFIX = `${REFORIS_URL_PREFIX}`;

export const API_MODULE_URLs = new Proxy(
    {
        // Packages
        dataCollection: "/data-collection/api/settings",
        openvpn: "/openvpn/api/server-settings",
        openvpnClients: "/openvpn/api/client-settings",
        netmetr: "/netmetr/api/data",
        schnapps: "/snapshots/api/snapshots/factory_reset",
        storage: "/storage/api/settings",
    },
    {
        get: (target, name) => `${API_URL_MODULES_PREFIX}${target[name]}`,
    }
);
