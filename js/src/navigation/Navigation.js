/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import { useUID } from "react-uid";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { matchPath, withRouter } from "react-router";

Navigation.propTypes = {
    pages: PropTypes.arrayOf(PropTypes.object),
    location: PropTypes.object.isRequired,
};

function Navigation({ pages, location }) {
    return pages.map((page) => {
        if (page.isHidden) return null;

        if (page.pages) {
            const active = matchPath(location.pathname, {
                path: page.path,
                strict: true,
            });
            return (
                <NavigationToggle key={page.name} active={!!active} {...page}>
                    {page.pages.map((subPage) => (
                        <NavigationToggleItem
                            key={subPage.name}
                            {...subPage}
                            path={`${page.path}${subPage.path}`}
                        />
                    ))}
                </NavigationToggle>
            );
        }

        return <NavigationMainItem key={page.name} {...page} />;
    });
}

NavigationToggle.propTypes = {
    name: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};

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

NavigationToggleItem.propTypes = {
    name: PropTypes.string.isRequired,
};

function NavigationToggleItem({ name, ...props }) {
    return (
        <NavigationItem {...props}>
            <small>{name}</small>
        </NavigationItem>
    );
}

NavigationMainItem.propTypes = {
    icon: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
};

function NavigationMainItem({ icon, name, ...props }) {
    return (
        <NavigationItem {...props}>
            {icon ? <Icon name={icon} /> : null}
            {name}
        </NavigationItem>
    );
}

NavigationItem.propTypes = {
    path: PropTypes.string.isRequired,
    isLinkOutside: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};

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

Icon.propTypes = {
    name: PropTypes.string.isRequired,
};

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
