/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import Notifications from "notifications/Notifications/Notifications";
import UpdateSettings from "packageManagement/updateSettings/UpdateSettings";
import Packages from "packageManagement/packages/Packages";
import Updates from "packageManagement/updates/Updates";
import About from "about/About";

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

import { ForisURLs } from "foris";

import { addWeightsToPages, plug } from "./utils";

const PAGES = [
    {
        name: _("Notifications"),
        path: "/notifications",
        icon: "bell",
        component: Notifications,
    },
    {
        name: _("Network Settings"),
        submenuId: "network-settings",
        path: "/network-settings",
        icon: "network-wired",
        pages: [
            {
                name: _("Wi-Fi"),
                path: "/wifi",
                component: WiFi,
            },
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
            {
                name: _("Interfaces"),
                path: "/interfaces",
                component: Interfaces,
            },
            {
                name: _("Guest Network"),
                path: "/guest-network",
                component: GuestNetwork,
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
        name: _("Package Management"),
        submenuId: "package-management",
        path: "/package-management",
        icon: "box",
        pages: [
            {
                name: _("Update Settings"),
                path: "/update-settings",
                component: UpdateSettings,
            },
            {
                name: _("Updates"),
                path: "/updates",
                component: Updates,
            },
            {
                name: _("Packages"),
                path: "/packages",
                component: Packages,
            },
        ],
    },
    {
        name: _("Advanced Administration"),
        path: ForisURLs.luci,
        icon: "cog",
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
    ForisPlugins.forEach((plugin) => {
        pagesWithWeight = plug(pagesWithWeight, plugin);
    });
    return pagesWithWeight;
}
