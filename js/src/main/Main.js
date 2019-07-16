/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {Redirect, Route, Switch,} from 'react-router';

import {REFORIS_PREFIX} from '../common/constants';
import RouterStateHandler from '../routerStateHandler/RouterStateHandler';
import Guide from '../guide/Guide';

import Navigation from './Navigation';
import TopBar from './TopBar';

export default function Main({routes, ws}) {
    const [outsideReactRouting, setInReactRouting] = useState(false);
    return <BrowserRouter basename={REFORIS_PREFIX}>
        <Portal containerId='navigation_container'>
            <Navigation htmlLinks={outsideReactRouting} routes={routes}/>
        </Portal>
        <Portal containerId='topbar_container'>
            <TopBar ws={ws}/>
        </Portal>
        <Portal containerId='router_state_handler_container'>
            <RouterStateHandler ws={ws}/>
        </Portal>
        <Portal containerId='guide_container'>
            <Guide ws={ws}/>
        </Portal>

        <Switch>
            <Route path='/' exact render={() => <Redirect to='/overview'/>}/>
            {routes.map((route, i) =>
                <RouteWithSubRoutes key={i} ws={ws} {...route}/>
            )}
            <Route path='*' render={() => setInReactRouting(true)}/>
        </Switch>
    </BrowserRouter>
}

function Portal({containerId, children}) {
    const container = document.getElementById(containerId);
    if (container)
        return ReactDOM.createPortal(children, container);
    return null;
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
