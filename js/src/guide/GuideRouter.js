/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import {
    BrowserRouter, Redirect, Route, Switch,
} from "react-router-dom";
import PropTypes from "prop-types";
import {
    AlertContextProvider,
    Portal,
    REFORIS_URL_PREFIX,
    withErrorMessage,
    withSpinnerOnSending,
} from "foris";

import { GUIDE_URL_PREFIX } from "./constants";
import GuideNavigation from "./GuideNavigation/GuideNavigation";
import GuidePage from "./GuidePage";

GuideRouter.propTypes = {
    ws: PropTypes.object.isRequired,
    guideData: PropTypes.object.isRequired,
    getGuideData: PropTypes.func.isRequired,
};

function GuideRouter({ ws, guideData, getGuideData }) {
    const { workflow_steps, next_step } = guideData;

    return (
        <BrowserRouter basename={`${REFORIS_URL_PREFIX}${GUIDE_URL_PREFIX}`}>
            <AlertContextProvider>
                <Portal containerId="guide-nav-container">
                    <GuideNavigation {...guideData} />
                </Portal>
                <Switch>
                    {workflow_steps.map((step) => (
                        <Route
                            exact
                            key={step}
                            path={`/${step}`}
                            render={() => (
                                <GuidePage
                                    ws={ws}
                                    step={step}
                                    getGuideData={getGuideData}

                                    {...guideData}
                                />
                            )}
                        />
                    ))}
                    <Redirect to={`/${next_step}`} />
                </Switch>
            </AlertContextProvider>
        </BrowserRouter>
    );
}

const GuideRouterWithErrorAndSpinner = withSpinnerOnSending(withErrorMessage(GuideRouter));

export default GuideRouterWithErrorAndSpinner;
