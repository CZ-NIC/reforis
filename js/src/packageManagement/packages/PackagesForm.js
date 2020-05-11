/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";
import { CheckBox } from "foris";

import UserOptions from "./UserOptions";
import "./PackagesForm.css";

PackagesForm.propTypes = {
    formData: PropTypes.shape({
        package_lists: PropTypes.arrayOf(PropTypes.shape({
            title: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            enabled: PropTypes.bool.isRequired,
            options: PropTypes.array.isRequired,
        })).isRequired,
    }),
    setFormValue: PropTypes.func,
    disabled: PropTypes.bool,
};

export default function PackagesForm({ formData, setFormValue, disabled }) {
    return (
        <>
            <h3>{_("Packages List")}</h3>
            <div className="container">
                <div className="packages-list">
                    {formData.package_lists.map(
                        (_package, idx) => (
                            <div className="package" key={_package.title}>
                                <CheckBox
                                    label={_package.title}
                                    helpText={_package.description}
                                    checked={_package.enabled}
                                    disabled={disabled}

                                    onChange={setFormValue((value) => ({
                                        package_lists: { [idx]: { enabled: { $set: value } } },
                                    }))}
                                />
                                {_package.options && _package.options.length > 0
                                    ? (
                                        <UserOptions
                                            packageIdx={idx}
                                            options={_package.options}
                                            setFormValue={setFormValue}
                                            disabled={disabled || !_package.enabled}
                                        />
                                    ) : null}
                            </div>
                        ),
                    )}
                </div>
            </div>
        </>
    );
}
