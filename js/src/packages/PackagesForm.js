/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import { CheckBox } from "foris";

PackagesForm.propTypes = {
    formData: PropTypes.shape({
        user_lists: PropTypes.arrayOf(PropTypes.shape({
            title: PropTypes.string.isRequired,
            msg: PropTypes.string.isRequired,
            enabled: PropTypes.bool.isRequired,
        })).isRequired,
    }),
    setFormValue: PropTypes.func,
    disabled: PropTypes.bool,
};

export default function PackagesForm({ formData, setFormValue, disabled }) {
    return (
        <>
            <h3>{_("Packages list")}</h3>
            {formData.user_lists.map(
                (_package, idx) => (
                    <CheckBox
                        label={_package.title}
                        key={idx}
                        helpText={_package.msg}
                        checked={_package.enabled}
                        disabled={disabled}

                        onChange={setFormValue((value) => ({
                            user_lists: { [idx]: { enabled: { $set: value } } },
                        }))}
                    />
                ),
            )}
        </>
    );
}
