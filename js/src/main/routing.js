/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {Redirect, Route, Switch} from 'react-router';

import Portal from 'utils/Portal';

import {PAGE_404, PAGES} from './constants';

const CONTENT_CONTAINER_ID = 'content_container';

export function RouteWithSubRoutes({ws, ...route}) {
    if (route.routes)
        return <Switch>
            {route.routes.map((subRoute, i) =>
                <RouteWithSubRoutes key={i} ws={ws} {...subRoute} path={`${route.path}${subRoute.path}`}/>
            )}
            <Redirect to={PAGE_404}/>
        </Switch>;

    const Component = PAGES[route.component];
    const contentContainer = document.getElementById(CONTENT_CONTAINER_ID);

    if (contentContainer)
        return <RouteWithTitle
            title={route.name}
            path={route.path}
            render={() => <Portal containerId={CONTENT_CONTAINER_ID}>
                <Component ws={ws}/>
            </Portal>}
        />;
    return null;
}

function RouteWithTitle({title, render, ...props}) {
    return <Route
        render={() => {
            document.title = `${title} - Foris`;
            return render();
        }}
        {...props}
    />
}
