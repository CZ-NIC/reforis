/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, {useEffect} from 'react';
import {BrowserRouter} from 'react-router-dom';
import {Redirect, Switch} from 'react-router';

import {REFORIS_URL_PREFIX} from 'common/constants';
import {useAPIGet} from 'common/APIhooks';
import API_URLs from 'common/API';
import Spinner from 'common/bootstrap/Spinner';
import Portal from 'utils/Portal';
import RouterStateHandler from 'routerStateHandler/RouterStateHandler';
import Navigation from 'navigation/Navigation';

import TopBar from './TopBar';
import {RouteWithSubRoutes} from './routing';
import {PAGE_404} from './constants';


export default function Main({ws}) {
    const [navState, getNav] = useAPIGet(API_URLs.navigation);

    useEffect(() => {
        getNav();
    }, [getNav]);

    if (navState.isLoading || !navState.data)
        return <Spinner fullScreen/>;

    return <BrowserRouter basename={REFORIS_URL_PREFIX}>
        <Portal containerId='navigation_container'>
            <Navigation routes={navState.data}/>
        </Portal>
        <Portal containerId='topbar_container'>
            <TopBar ws={ws}/>
        </Portal>
        <Portal containerId='router_state_handler_container'>
            <RouterStateHandler ws={ws}/>
        </Portal>

        <Switch>
            {navState.data.map((route, i) =>
                <RouteWithSubRoutes key={i} ws={ws} {...route}/>
            )}
            <Redirect to={PAGE_404}/>
        </Switch>
    </BrowserRouter>
}

