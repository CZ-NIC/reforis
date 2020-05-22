/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";
import { useUID } from "react-uid";
import Labels from "./Labels/Labels";

PackageCheckBox.propTypes = {
    name: PropTypes.string.isRequired,
    labels: PropTypes.arrayOf(PropTypes.object).isRequired,
    helpText: PropTypes.string,
    disabled: PropTypes.bool,
};

PackageCheckBox.defaultProps = {
    disabled: false,
};

export default function PackageCheckBox({
    name, labels, helpText, disabled, ...props
}) {
    const uid = useUID();
    return (
        <div className="form-group">
            <div className="custom-control custom-checkbox ">
                <input
                    className="custom-control-input"
                    type="checkbox"
                    id={uid}
                    disabled={disabled}

                    {...props}
                />
                <label className="custom-control-label" htmlFor={uid}>
                    {name}
                    <Labels labels={labels} disabled={disabled} />
                    {helpText && <small className="form-text text-muted">{helpText}</small>}
                </label>
            </div>
        </div>
    );
}
