/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {Redirect, Route, Switch,} from 'react-router';
import {BrowserRouter} from 'react-router-dom';
import Navigation from './Navigation';


export default function Main({routes, ws}) {
    return <BrowserRouter>
        <Navigation routes={routes}/>
        <Switch>
            <Route path='/' exact render={() => <Redirect to='/overview'/>}/>
            {routes.map((route, i) => <RouteWithSubRoutes key={i} ws={ws} {...route}/>)}
            <Redirect to='/404'/>
        </Switch>
    </BrowserRouter>
}

function RouteWithSubRoutes({ws, ...route}) {
    if (route.component)
        return <Route path={route.path} render={() => <route.component ws={ws}/>}/>;
    if (route.routes)
        return route.routes.map((subRoute, i) =>
            <RouteWithSubRoutes key={i} ws={ws} {...subRoute} path={`${route.path}${subRoute.path}`}/>
        );
    return null;
}
