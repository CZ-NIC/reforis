/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import "./NavigationItem.css";

NavigationItem.propTypes = {
    path: PropTypes.string.isRequired,
    isLinkOutside: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};

const SMALL_SCREEN_WIDTH = 768;

export default function NavigationItem({ path, children, isLinkOutside }) {
    if (isLinkOutside) {
        return (
            <li>
                <a href={path}>
                    {children}
                    <i className="fas fa-external-link-alt link-outside-icon" />
                </a>
            </li>
        );
    }

    return (
        <li
            {...(window.outerWidth <= SMALL_SCREEN_WIDTH
                ? {
                      "data-toggle": "collapse",
                      "data-target": "#navigation-container-collapse",
                  }
                : {})}
        >
            <NavLink to={path}>{children}</NavLink>
        </li>
    );
}
