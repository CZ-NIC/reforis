/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {useUID} from 'react-uid';
import {matchPath, withRouter} from "react-router";
import {ForisNavLink} from './links';

function Navigation({routes, location}) {
    return routes.map((route, i) => {
        if (route.isHidden)
            return null;

        if (route.routes) {
            const active = matchPath(location.pathname, {
                path: route.path,
                strict: true,
            });
            return <NavigationToggle key={i} active={!!active} {...route}>
                {route.routes.map((subRoute, j) =>
                    <NavigationToggleItem
                        key={j}
                        {...subRoute}
                        path={`${route.path}${subRoute.path}`}
                    />
                )}
            </NavigationToggle>;
        }

        return <NavigationMainItem key={i}  {...route} />;
    })
}

function NavigationToggle({name, icon, active, children}) {
    const uid = useUID();
    return <li>
        <a className={'dropdown-toggle ' + (active ? 'active' : '')}
           href={`#nav-toggle-${uid}`}
           data-toggle="collapse"
        >
            {icon ? <Icon name={icon}/> : null}
            {name}
        </a>
        <ul className={'collapse list-unstyled ' + (active ? 'show' : '')}
            id={`nav-toggle-${uid}`}
        >
            {children}
        </ul>

    </li>
}

function NavigationToggleItem({name, ...props}) {
    return <NavigationItem {...props}>
        <small>{name}</small>
    </NavigationItem>
}

function NavigationMainItem({icon, name, ...props}) {
    return <NavigationItem {...props}>
        {icon ? <Icon name={icon}/> : null}
        {name}
    </NavigationItem>
}

function NavigationItem({path, children, component, ...props}) {
    return <li>
        <ForisNavLink to={path} {...props}>
            {children}
        </ForisNavLink>
    </li>
}

function Icon({name}) {
    return <>
        <i className={'fas fa-fw fa-' + name}/>
        &nbsp;&nbsp;&nbsp;
    </>
}

const NavigationWithRouter = withRouter(Navigation);
export default NavigationWithRouter;
