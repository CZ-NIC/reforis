/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

GuideNavigationItem.propTypes = {
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    passed: PropTypes.bool.isRequired,
    next: PropTypes.bool.isRequired,
};

export default function GuideNavigationItem({ name, url, next, passed }) {
    const passedClassName = passed ? "passed" : "";
    const nextClassName = next ? "next" : "";

    const content = (
        <>
            <i className="fas fa-angle-right mr-2" />
            {name}
        </>
    );

    return (
        <li>
            {passed || next ? (
                <NavLink
                    className={`${passedClassName} ${nextClassName}`}
                    to={url}
                >
                    {content}
                </NavLink>
            ) : (
                // eslint-disable-next-line jsx-a11y/anchor-is-valid
                <a>{content}</a>
            )}
        </li>
    );
}
