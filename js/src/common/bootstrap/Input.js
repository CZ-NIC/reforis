/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import { useUID } from "react-uid/dist/es5/index";
import PropTypes from "prop-types";
import { formFieldsSize } from "./constants";

Input.propTypes = {
    type: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    helpText: PropTypes.string,
    error: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};

/** Base bootstrap input component. */
export default function Input({
    type, label, helpText, error, className, children, ...props
}) {
    const uid = useUID();
    const inputClassName = `form-control ${className || ""} ${(error ? "is-invalid" : "")}`.trim();
    return (
        <div className={formFieldsSize}>
            <div className="form-group">
                <label htmlFor={uid}>{label}</label>
                <div className="input-group">
                    <input
                        className={inputClassName}
                        type={type}
                        id={uid}

                        {...props}
                    />
                    {children}
                </div>
                {error ? <div className="invalid-feedback">{error}</div> : null}
                {helpText ? <small className="form-text text-muted">{helpText}</small> : null}
            </div>
        </div>
    );
}
