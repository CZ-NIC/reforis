/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import {
    PasswordInput, CheckBox, SubmitButton, SUBMIT_BUTTON_STATES,
} from "foris";

ForisPasswordForm.propTypes = {
    formData: PropTypes.shape({
        newForisPassword: PropTypes.string,
        sameForRoot: PropTypes.bool,
    }).isRequired,
    submitButtonState: PropTypes.oneOf(
        Object.keys(SUBMIT_BUTTON_STATES).map((key) => SUBMIT_BUTTON_STATES[key]),
    ).isRequired,
    formErrors: PropTypes.shape(
        { newForisPassword: PropTypes.string },
    ),
    setFormValue: PropTypes.func.isRequired,
    postForisPassword: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

export default function ForisPasswordForm({
    formData, formErrors, setFormValue, submitButtonState, postForisPassword, disabled,
}) {
    return (
        <form onSubmit={postForisPassword}>
            <h4>{_("Foris Password")}</h4>
            <p>{_("Set your password for this administration interface.")}</p>
            <PasswordInput
                withEye
                label={_("New Foris password")}
                value={formData.newForisPassword}
                error={formErrors.newForisPassword}

                onChange={setFormValue(
                    (value) => ({ newForisPassword: { $set: value } }),
                )}

                disabled={disabled}
            />
            <CheckBox
                label={_("Use same password for advanced administration (root)")}
                helpText={_("Same password would be used for accessing this administration interface, for root user in "
                + "LuCI web interface and for SSH login. Use a strong password! (If you choose not to set the password "
                + "for advanced configuration here, you will have the option to do so later. Until then, the root account "
                + "will be blocked.)")}
                checked={formData.sameForRoot}

                onChange={setFormValue(
                    (value) => ({ sameForRoot: { $set: value } }),
                )}

                disabled={disabled}
            />
            <div className="text-right">
                <SubmitButton
                    state={submitButtonState}
                    disabled={!!formErrors.newForisPassword}
                />
            </div>
        </form>
    );
}
