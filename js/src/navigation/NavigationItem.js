/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

NavigationItem.propTypes = {
    path: PropTypes.string.isRequired,
    isLinkOutside: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};

export default function NavigationItem({ path, children, isLinkOutside }) {
    if (isLinkOutside) return <li><a href={path}>{children}</a></li>;

    return (
        <li>
            <NavLink to={path}>
                {children}
            </NavLink>
        </li>
    );
}
