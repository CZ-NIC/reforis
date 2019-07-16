/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {NavLink} from 'react-router-dom';
import {matchPath, withRouter} from "react-router";
import {useUID} from 'react-uid';
import {REFORIS_PREFIX} from '../common/constants';


function Navigation({routes, location, htmlLinks}) {
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
                        htmlLink={htmlLinks || route.isLink}
                        {...subRoute}
                        path={`${route.path}${subRoute.path}`}
                    />
                )}
            </NavigationToggle>;
        }

        return <NavigationItem key={i} htmlLink={htmlLinks || route.isLink}  {...route} />;
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

function NavigationToggleItem({path, name, active, htmlLink}) {
    const content = <small>{name}</small>;
    return <li className={active ? 'active' : ''}>
        {htmlLink ?
            <a href={`${REFORIS_PREFIX}${path}`}>{content}</a> :
            <NavLink activeClassName='active' to={path}>{content}</NavLink>}
    </li>
}


function NavigationItem({path, icon, name, active, htmlLink}) {
    const content = <>
        {icon ? <Icon name={icon}/> : null}
        {name}
    </>;

    return <li className={active ? 'active' : ''}>
        {htmlLink ?
            <a href={`${REFORIS_PREFIX}${path}`}>{content}</a> :
            <NavLink activeClassName='active' to={path}>{content}</NavLink>}
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
