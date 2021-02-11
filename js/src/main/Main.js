/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect } from "react";
import { BrowserRouter, Redirect, Switch } from "react-router-dom";
import PropTypes from "prop-types";

import {
    REFORIS_URL_PREFIX,
    Portal,
    AlertContextProvider,
    useAPIGet,
    withSending,
    withErrorMessage,
} from "foris";

import Navigation from "navigation/Navigation";
import ErrorBoundary from "utils/ErrorBoundary";
import API_URLs from "../common/API";
import TopBar from "./TopBar/TopBar";
import RouteWithSubRoutes from "./routing";
import getPages from "./pages";
import { REDIRECT_404_PAGE } from "./constants";
import ScrollToTopArrow from "../common/ScrollToTopArrow";

Main.propTypes = {
    ws: PropTypes.object.isRequired,
};

export default function Main({ ws }) {
    const [getCustomizationResponse, getCustomization] = useAPIGet(
        API_URLs.about
    );

    useEffect(() => {
        getCustomization();
    }, [getCustomization]);

    return (
        <CustomizationWithError
            apiState={getCustomizationResponse.state}
            deviceDetails={getCustomizationResponse.data || {}}
            ws={ws}
        />
    );
}

MainWrapper.propTypes = {
    ws: PropTypes.object.isRequired,
    deviceDetails: PropTypes.object.isRequired,
};

function MainWrapper({ deviceDetails, ws }) {
    const pages = getPages(deviceDetails);
    // Outer ErrorBoundary catches errors outside content container
    return (
        <ErrorBoundary>
            <BrowserRouter basename={REFORIS_URL_PREFIX}>
                <AlertContextProvider>
                    <Portal containerId="navigation-container">
                        <Navigation pages={pages} />
                    </Portal>
                    <Portal containerId="top-bar-container">
                        <TopBar ws={ws} />
                    </Portal>
                    <Portal containerId="scroll-to-top">
                        <ScrollToTopArrow />
                    </Portal>
                    {/* Handle errors and display Navigation and TopBar. */}
                    <ErrorBoundary>
                        <Switch>
                            {pages.map((route) => (
                                <RouteWithSubRoutes
                                    key={route}
                                    ws={ws}
                                    {...route}
                                />
                            ))}
                            <Redirect to={REDIRECT_404_PAGE} />
                        </Switch>
                    </ErrorBoundary>
                </AlertContextProvider>
            </BrowserRouter>
        </ErrorBoundary>
    );
}

const withoutSpinner = withSending(() => null);

const CustomizationWithError = withoutSpinner(withErrorMessage(MainWrapper));
