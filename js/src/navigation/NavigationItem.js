/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { SMALL_SCREEN_WIDTH } from "./utils";
import "./NavigationItem.css";

NavigationItem.propTypes = {
    path: PropTypes.string.isRequired,
    isLinkOutside: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};

export default function NavigationItem({ path, children, isLinkOutside }) {
    if (isLinkOutside) {
        return (
            <li>
                <a
                    href={path}
                    className="text-truncate"
                    title={children[1]}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {children}
                    <sup>
                        <i className="fas fa-external-link-alt link-outside-icon fa-xs" />
                    </sup>
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
