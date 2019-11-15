/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect } from "react";
import { Redirect, Route, Switch } from "react-router";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";

import { Portal, useAlert } from "foris";

import { REDIRECT_404_PAGE } from "./constants";

const CONTENT_CONTAINER_ID = "content-container";

RouteWithSubRoutes.propTypes = {
    ws: PropTypes.object.isRequired,
};

export default function RouteWithSubRoutes({ ws, ...route }) {
    if (route.pages) {
        return (
            <Switch>
                {route.pages.map((subRoute) => {
                    const path = `${route.path}${subRoute.path}`;
                    return (
                        <RouteWithSubRoutes
                            key={path}
                            ws={ws}
                            {...subRoute}
                            path={path}
                        />
                    );
                })}
                <Redirect to={REDIRECT_404_PAGE} />
            </Switch>
        );
    }

    const contentContainer = document.getElementById(CONTENT_CONTAINER_ID);
    const Component = route.component;
    if (contentContainer) {
        return (
            <RouteWithTitle
                title={route.name}
                path={route.path}
                render={() => (
                    <Portal containerId={CONTENT_CONTAINER_ID}>
                        <Component ws={ws} />
                    </Portal>
                )}
            />
        );
    }
    return null;
}

RouteWithTitle.propTypes = {
    title: PropTypes.string.isRequired,
    render: PropTypes.func.isRequired,
};

function RouteWithTitle({ title, render, ...props }) {
    /* Dismiss alert on changing location */
    const [, dismissAlert] = useAlert();
    const location = useLocation();
    useEffect(() => {
        dismissAlert();
    }, [location, dismissAlert]);

    return (
        <Route
            render={() => {
                document.title = `${title} - Foris`;
                return render();
            }}
            {...props}
        />
    );
}
