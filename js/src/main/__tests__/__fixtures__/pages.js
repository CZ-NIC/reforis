/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

export const PAGES = [
    {
        path: "/one",
        name: "One",
        component: () => () => <p>One</p>,
    }, {
        path: "/two",
        name: "Two",
        component: () => <p>Two</p>,
    }, {
        path: "/three",
        name: "Three",
        component: () => <p>Three</p>,
    }, {
        path: "/first-submenu",
        submenuId: "first-submenu",
        name: "First submenu",
        pages: [
            {
                path: "/sub-one",
                name: "SubOne",
                component: () => <p>SubOne</p>,
            }, {
                path: "/sub-two",
                name: "SubTwo",
                component: () => <p>SubTwo</p>,
            }, {
                path: "/sub-three",
                name: "SubThree",
                component: () => <p>SubThree</p>,
            }
        ]
    }, {
        path: "/five",
        name: "Five",
        component: () => <p>Five</p>,
    }, {
        path: "/second-submenu",
        submenuId: "second-submenu",
        name: "Second submenu",
        pages: [{
            path: "/sec-sub-one",
            name: "SecSubOne",
            component: () => <p>SecSubOne</p>,
        }]
    }
];
