/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";
import { useUID } from "react-uid";

import NavigationItem from "./NavigationItem";
import getIconElement from "./utils";

NavigationToggle.propTypes = {
    name: PropTypes.string.isRequired,
    icon: PropTypes.oneOfType([
        PropTypes.string.isRequired,
        PropTypes.node,
    ]),
    active: PropTypes.bool.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};

export function NavigationToggle({
    name, icon, active, children,
}) {
    const uid = useUID();
    const iconElement = getIconElement(icon);

    return (
        <li>
            <a
                className={`dropdown-toggle ${active ? "active" : ""}`}
                href={`#nav-toggle-${uid}`}
                data-toggle="collapse"
            >
                {iconElement}
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

export function NavigationToggleItem({ name, ...props }) {
    return (
        <NavigationItem {...props}>
            <small>{name}</small>
        </NavigationItem>
    );
}
