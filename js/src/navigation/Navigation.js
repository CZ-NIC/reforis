/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import { useUID } from "react-uid";
import { matchPath, withRouter } from "react-router";
import { NavLink } from "react-router-dom";

function Navigation({ pages, location }) {
    return pages.map((page, i) => {
        if (page.isHidden) return null;

        if (page.pages) {
            const active = matchPath(location.pathname, {
                path: page.path,
                strict: true,
            });
            return (
                <NavigationToggle key={i} active={!!active} {...page}>
                    {page.pages.map((subPage, j) => (
                        <NavigationToggleItem
                            key={j}
                            {...subPage}
                            path={`${page.path}${subPage.path}`}
                        />
                    ))}
                </NavigationToggle>
            );
        }

        return <NavigationMainItem key={i} {...page} />;
    });
}

function NavigationToggle({
    name, icon, active, children,
}) {
    const uid = useUID();
    return (
        <li>
            <a
                className={`dropdown-toggle ${active ? "active" : ""}`}
                href={`#nav-toggle-${uid}`}
                data-toggle="collapse"
            >
                {icon ? <Icon name={icon} /> : null}
                {name}
            </a>
            <ul
                className={`collapse list-unstyled ${active ? "show" : ""}`}
                id={`nav-toggle-${uid}`}
            >
                {children}
            </ul>

        </li>
    );
}

function NavigationToggleItem({ name, ...props }) {
    return (
        <NavigationItem {...props}>
            <small>{name}</small>
        </NavigationItem>
    );
}

function NavigationMainItem({ icon, name, ...props }) {
    return (
        <NavigationItem {...props}>
            {icon ? <Icon name={icon} /> : null}
            {name}
        </NavigationItem>
    );
}

function NavigationItem({ path, children, isLinkOutside }) {
    if (isLinkOutside) return <li><a href={path}>{children}</a></li>;

    return (
        <li>
            <NavLink to={path}>
                {children}
            </NavLink>
        </li>
    );
}

function Icon({ name }) {
    return (
        <>
            <i className={`fas fa-fw fa-${name}`} />
        &nbsp;&nbsp;&nbsp;
        </>
    );
}

const NavigationWithRouter = withRouter(Navigation);
export default NavigationWithRouter;
