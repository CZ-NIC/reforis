/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

export const pluginInRoot = () => ({
    name: "Plugin in root",
    path: "/plugin-in-root",
    icon: "icon",
    component: () => <p>Root</p>,
});

export const pluginInRootWithoutIcon = () => ({
    name: "Plugin in root",
    path: "/plugin-in-root",
    component: () => <p>Root</p>,
});

export const pluginInExistedSubmenu = (submenuId, weight) => ({
    path: "/plugin-in-submenu",
    name: "Plugin in submenu",
    icon: "icon",
    submenuId,
    weight,
    component: () => <p>SubPlugin</p>,
});

export const newSubmenu = (submenuId, weight) => ({
    submenuId,
    name: "New Submenu",
    icon: "icon",
    weight,
    path: "/plugin-in-submenu",
    pages: [
        {
            name: "SubPlugin one",
            path: "/sub-plugin-one",
            component: () => <p>SubPlugin One</p>,
        },
        {
            name: "SubPlugin two",
            path: "/sub-plugin-two",
            component: () => <p>SubPlugin Two</p>,
        },
    ],
});
