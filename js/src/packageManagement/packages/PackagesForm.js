/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import "./PackagesForm.css";
import Package from "./Package";

PackagesForm.propTypes = {
    formData: PropTypes.shape({
        package_lists: PropTypes.arrayOf(
            PropTypes.shape({
                title: PropTypes.string.isRequired,
            })
        ),
    }),
    setFormValue: PropTypes.func,
    disabled: PropTypes.bool,
};

export default function PackagesForm({ formData, setFormValue, disabled }) {
    return (
        <>
            <h2>{_("Packages List")}</h2>
            <div className="container-fluid">
                <div className="packages-list">
                    {formData.package_lists.map((_package, index) => (
                        <Package
                            {..._package}
                            index={index}
                            setFormValue={setFormValue}
                            disabled={disabled}
                            key={_package.title}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}
