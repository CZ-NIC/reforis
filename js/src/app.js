// eslint-disable-line
/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

// It force ReactRouterDOM to be exposed. See:
// https://github.com/webpack-contrib/expose-loader/issues/20.
// eslint-disable-next-line
import "expose-loader?ReactRouterDOM!react-router-dom";

// eslint-disable-next-line
import pdfMake from "expose-loader?pdfMake!pdfmake/build/pdfmake";
// eslint-disable-next-line
import pdfFonts from "pdfmake/build/vfs_fonts";

import React from "react";
import { render } from "react-dom";
import "@fortawesome/fontawesome-free/js/all.min";
import "bootstrap/dist/js/bootstrap.min";
import "bootswatch/dist/flatly/bootstrap.css";
import "./app.css";

import { WebSockets } from "foris";
import RouterStateHandler from "routerStateHandler/RouterStateHandler";

import Main from "main/Main";
import Guide from "guide/Guide";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const ws = new WebSockets();

window.AlertContext = React.createContext();

window.addEventListener("load", () => {
    const guideContainer = document.getElementById("guide-container");
    const mainContainer = document.getElementById("app-container");
    if (guideContainer) {
        render(<Guide ws={ws} />, guideContainer);
    } else if (mainContainer) {
        render(<Main ws={ws} />, mainContainer);
    }

    const routerStateHandlerContainer = document.getElementById("router-state-handler");
    if (routerStateHandlerContainer) {
        render(<RouterStateHandler ws={ws} />, routerStateHandlerContainer);
    }
}, false);
