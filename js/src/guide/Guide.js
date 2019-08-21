/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { Redirect, Route, Switch } from "react-router";
import PropTypes from "prop-types";

import Portal from "utils/Portal";
import { REFORIS_URL_PREFIX } from "common/constants";
import { useAPIGet } from "common/APIhooks";
import API_URLs from "common/API";
import Spinner from "common/bootstrap/Spinner";

import { GUIDE_URL_PREFIX, STEPS } from "./constance";
import GuideNavigation from "./GuideNavigation";

Guide.propTypes = {
    ws: PropTypes.object.isRequired,
};

export default function Guide({ ws }) {
    const [guideData, getGuideData] = useAPIGet(API_URLs.guide);
    useEffect(() => {
        getGuideData();
    }, [getGuideData]);

    if (!guideData.data) return <Spinner className="row justify-content-center" />;

    const {
        available_workflows, workflow_steps, next_step, passed,
    } = guideData.data;

    return (
        <BrowserRouter basename={`${REFORIS_URL_PREFIX}${GUIDE_URL_PREFIX}`}>
            <Portal containerId="guide_nav_container">
                <GuideNavigation
                    workflow_steps={workflow_steps}
                    passed={passed}
                    next_step={next_step}
                />
            </Portal>
            <Switch>
                {workflow_steps.map((step, idx) => {
                    const Component = STEPS[step].component;
                    return (
                        <Route
                            exact
                            key={idx}
                            path={`/${step}`}
                            render={() => (
                                <Component
                                    ws={ws}
                                    next_step={next_step}
                                    postCallback={getGuideData}
                                    workflows={available_workflows}
                                />
                            )}
                        />
                    );
                })}
                <Redirect to={`/${next_step}`} />
            </Switch>
        </BrowserRouter>
    );
}
