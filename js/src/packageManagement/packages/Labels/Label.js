/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import "./Label.css";

Label.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    severity: PropTypes.oneOf(
        ["danger", "warning", "info", "success", "primary", "secondary", "light", "dark"],
    ).isRequired,
    disabled: PropTypes.bool,
};

export default function Label({
    title, description, severity, disabled,
}) {
    return (
        <span
            title={description}
            className={`badge badge-${severity}${disabled ? " badge-disabled" : ""}`}
        >
            {title}
        </span>
    );
}
