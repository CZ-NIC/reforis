/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import { PasswordInput } from "foris";

CurrentForisPasswordForm.propTypes = {
    formData: PropTypes.shape(
        { currentForisPassword: PropTypes.string },
    ).isRequired,
    setFormValue: PropTypes.func.isRequired,
};

export default function CurrentForisPasswordForm({ formData, setFormValue, ...props }) {
    return (
        <PasswordInput
            withEye
            label={_("Current Foris password")}
            value={formData.currentForisPassword}

            onChange={setFormValue(
                (value) => ({ currentForisPassword: { $set: value } }),
            )}

            {...props}
        />
    );
}
