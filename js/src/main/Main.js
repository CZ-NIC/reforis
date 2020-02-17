/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import { BrowserRouter, Redirect, Switch } from "react-router-dom";
import PropTypes from "prop-types";

import { REFORIS_URL_PREFIX, Portal, AlertContextProvider } from "foris";

import Navigation from "navigation/Navigation";

import TopBar from "./TopBar";
import RouteWithSubRoutes from "./routing";
import getPages from "./pages";
import { REDIRECT_404_PAGE } from "./constants";

Main.propTypes = {
    ws: PropTypes.object.isRequired,
};

export default function Main({ ws }) {
    const pages = getPages();
    return (
        <BrowserRouter basename={REFORIS_URL_PREFIX}>
            <AlertContextProvider>
                <Portal containerId="navigation-container">
                    <Navigation pages={pages} />
                </Portal>
                <Portal containerId="top-bar-container">
                    <TopBar ws={ws} />
                </Portal>

                <Switch>
                    {pages.map((route) => <RouteWithSubRoutes key={route} ws={ws} {...route} />)}
                    <Redirect to={REDIRECT_404_PAGE} />
                </Switch>
            </AlertContextProvider>
        </BrowserRouter>
    );
}
