/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import { Redirect, Route, Switch } from "react-router";
import PropTypes from "prop-types";

import Portal from "utils/Portal";

import { REDIRECT_404_PAGE } from "./constants";

const CONTENT_CONTAINER_ID = "content_container";

RouteWithSubRoutes.propTypes = {
    ws: PropTypes.object.isRequired,
};

export default function RouteWithSubRoutes({ ws, ...route }) {
    if (route.pages) {
        return (
            <Switch>
                {route.pages.map((subRoute, i) => <RouteWithSubRoutes key={i} ws={ws} {...subRoute} path={`${route.path}${subRoute.path}`} />)}
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
