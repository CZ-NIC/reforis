/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

export const pluginInRoot = (weight) => ({
    weight,
    name: "Plugin in root",
    path: "/plugin-in-root",
    component: () => <p>Root</p>,
});

export const pluginInExistedSubmenu = (submenuId, weight) => ({
    path: "/plugin-in-submenu",
    name: "Plugin in submenu",
    submenuId,
    weight,
    component: () => <p>SubPlugin</p>,
});

export const newSubmenu = (submenuId, weight) => ({
    submenuId,
    name: "New Submenu",
    weight,
    path: "/plugin-in-submenu",
    pages: [
        {
            name: "SubPlugin one",
            path: "/sub-plugin-one",
            component: () => <p>SubPlugin One</p>,
        }, {

            name: "SubPlugin two",
            path: "/sub-plugin-two",
            component: () => <p>SubPlugin Two</p>,
        },
    ],
});
