/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import {NavLink} from 'react-router-dom';
import {useUID} from 'react-uid';

const NAVIGATION_CONTAINER_ID = 'navigation_container';

export default function Navigation({routes}) {
    const navigationContainer = document.getElementById(NAVIGATION_CONTAINER_ID);

    return ReactDOM.createPortal(
        <>{
            routes.map((route, i) => {
                if (route.component)
                    return <NavigationItem key={i} {...route} />;
                if (route.routes)
                    return <NavigationToggle key={i} {...route}>
                        {route.routes.map((subRoute, j) =>
                            <NavigationToggleItem key={j} {...subRoute} path={`${route.path}${subRoute.path}`}/>
                        )}
                    </NavigationToggle>;
                return null;
            })
        }</>,
        navigationContainer,
    );
}

function NavigationToggle({name, icon, active, children}) {
    const uid = useUID();
    return <li className={active ? 'active' : ''}>
        <a
            href={`#nav-toggle-${uid}`}
            className="dropdown-toggle"
            data-toggle="collapse"
        >
            {icon ? <Icon name={icon}/> : null}
            {name}
        </a>
        <ul
            className={"collapse list-unstyled " + (active ? 'show' : '')}
            id={`nav-toggle-${uid}`}
        >
            {children}
        </ul>

    </li>
}

function NavigationToggleItem({path, name, active}) {
    return <li className={active ? 'active' : ''}>
        <NavLink activeClassName='active' to={path} className='text-center'>
            <small>{name}</small>
        </NavLink>
    </li>
}


function NavigationItem({path, icon, name, active}) {
    return <li className={active ? 'active' : ''}>
        <NavLink activeClassName='active' to={path}>
            {icon ? <Icon name={icon}/> : null}
            {name}
        </NavLink>
    </li>
}

function Icon({name}) {
    return <>
        <i className={'fas fa-fw fa-' + name}/>
        &nbsp;&nbsp;&nbsp;
    </>
}
