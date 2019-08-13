/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, {useState} from 'react';
import {BrowserRouter} from 'react-router-dom';
import {Redirect, Route, Switch} from 'react-router';

import {REFORIS_URL_PREFIX} from '../common/constants';
import RouterStateHandler from '../routerStateHandler/RouterStateHandler';

import Navigation from './Navigation';
import TopBar from './TopBar';
import Portal from '../utils/Portal';

export const outsideReactRoutingContext = React.createContext();

export default function Main({routes, ws}) {
    const [outsideReactRouting, setOutsideReactRouting] = useState(false);
    return <BrowserRouter basename={REFORIS_URL_PREFIX}>
        <outsideReactRoutingContext.Provider value={outsideReactRouting}>
            <Portal containerId='navigation_container'>
                <Navigation routes={routes}/>
            </Portal>
            <Portal containerId='topbar_container'>
                <TopBar ws={ws}/>
            </Portal>
            <Portal containerId='router_state_handler_container'>
                <RouterStateHandler ws={ws}/>
            </Portal>

            <Switch>
                <Route path='/' exact render={() => <Redirect to='/notifications'/>}/>
                {routes.map((route, i) =>
                    <RouteWithSubRoutes key={i} ws={ws} {...route}/>
                )}
                <Route path='*' render={() => setOutsideReactRouting(true)}/>
            </Switch>
        </outsideReactRoutingContext.Provider>
    </BrowserRouter>
}

const CONTENT_CONTAINER_ID = 'content_container';

function RouteWithSubRoutes({ws, ...route}) {
    if (route.routes)
        return route.routes.map((subRoute, i) =>
            <RouteWithSubRoutes key={i} ws={ws} {...subRoute} path={`${route.path}${subRoute.path}`}/>
        );

    const contentContainer = document.getElementById(CONTENT_CONTAINER_ID);
    if (contentContainer)
        return <RouteWithTitle
            title={route.name}
            path={route.path}
            render={() => <Portal containerId={CONTENT_CONTAINER_ID}>
                <route.component ws={ws}/>
            </Portal>}
        />;
    return null;
}

function RouteWithTitle({title, render, ...props}) {
    return <Route {...props} render={() => {
        document.title = `${title} - Foris`;
        return render();
    }}/>
}
