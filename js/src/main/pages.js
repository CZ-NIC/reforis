/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import UpdateSettings from "packageManagement/updateSettings/UpdateSettings";
import Packages from "packageManagement/packages/Packages";
import Updates from "packageManagement/updates/Updates";
import Languages from "packageManagement/languages/Languages";

import WiFi from "wifi/WiFi";
import WAN from "wan/WAN";
import LAN from "lan/LAN";
import DNS from "dns/DNS";
import Interfaces from "interfaces/Interfaces";
import GuestNetwork from "guestNetwork/GuestNetwork";

import Password from "password/Password";
import RegionAndTime from "regionAndTime/RegionAndTime";
import NotificationsSettings from "notificationsSettings/NotificationsSettings";
import Reboot from "reboot/Reboot";

import About from "about/About";
import Overview from "overview/Overview";

import { ForisURLs } from "foris";

import { addWeightsToPages, plug } from "./utils";

const PAGES = [
    {
        name: _("Overview"),
        path: "/overview",
        icon: "chart-line",
        component: Overview,
    },
    {
        name: _("Network Settings"),
        submenuId: "network-settings",
        path: "/network-settings",
        icon: "network-wired",
        pages: [
            {
                name: _("WAN"),
                path: "/wan",
                component: WAN,
            },
            {
                name: _("LAN"),
                path: "/lan",
                component: LAN,
            },
            {
                name: _("DNS"),
                path: "/dns",
                component: DNS,
            },
        ],
    },
    {
        name: _("Administration"),
        submenuId: "administration",
        path: "/administration",
        icon: "user-cog",
        pages: [
            {
                name: _("Password"),
                path: "/password",
                component: Password,
            },
            {
                name: _("Region & Time"),
                path: "/region-and-time",
                component: RegionAndTime,
            },
            {
                name: _("Notification Settings"),
                path: "/notifications-settings",
                component: NotificationsSettings,
            },
            {
                name: _("Reboot"),
                path: "/reboot",
                component: Reboot,
            },
        ],
    },
    {
        name: _("Global Threat Statistics"),
        path: "https://view.sentinel.turris.cz",
        icon: "chart-line",
        isLinkOutside: true,
    },
    {
        name: _("About"),
        path: "/about",
        icon: "info-circle",
        component: About,
    },
];

export default function getPages() {
    let pagesWithWeight = addWeightsToPages(PAGES);
    const waitingPluginsList = [];
    ForisPlugins.forEach((plugin) => {
        try {
            pagesWithWeight = plug(pagesWithWeight, plugin);
        } catch (e) {
            if (e.name === "TypeError") {
                waitingPluginsList.push(plugin);
            }
        }
    });

    waitingPluginsList.forEach((plugin) => {
        pagesWithWeight = plug(pagesWithWeight, plugin);
    });

    return pagesWithWeight;
}
