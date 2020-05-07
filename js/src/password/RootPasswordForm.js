/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import {
    ForisURLs, PasswordInput, SubmitButton, SUBMIT_BUTTON_STATES,
} from "foris";

RootPasswordForm.propTypes = {
    formData: PropTypes.shape(
        { newRootPassword: PropTypes.string },
    ).isRequired,
    submitButtonState: PropTypes.oneOf(
        Object.keys(SUBMIT_BUTTON_STATES).map((key) => SUBMIT_BUTTON_STATES[key]),
    ).isRequired,
    formErrors: PropTypes.shape({ newRootPassword: PropTypes.string }),
    setFormValue: PropTypes.func.isRequired,
    postRootPassword: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

export default function RootPasswordForm({
    formData, formErrors, setFormValue, submitButtonState, postRootPassword, disabled,
}) {
    return (
        <form onSubmit={postRootPassword} className="mt-3">
            <h4>{_("Advanced Administration (root) Password")}</h4>
            <p
                dangerouslySetInnerHTML={{
                    __html: babel.format(_(
                        `In order to access the advanced configuration options which are not available here, you must
set the root user's password. The advanced configuration options can be managed either 
through the <a href="%s">LuCI web interface</a> or via SSH.`,
                    ), ForisURLs.luci),
                }}
            />
            <PasswordInput
                withEye
                label={_("New advanced administration password")}
                value={formData.newRootPassword}
                error={formErrors.newRootPassword}

                onChange={setFormValue(
                    (value) => ({ newRootPassword: { $set: value } }),
                )}

                disabled={disabled}
            />
            <div className="text-right">
                <SubmitButton
                    state={submitButtonState}
                    disabled={!!formErrors.newRootPassword}
                />
            </div>
        </form>
    );
}
