/*
 * Copyright (C) 2020-2021 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import {
    ForisURLs,
    PasswordInput,
    SubmitButton,
    SUBMIT_BUTTON_STATES,
} from "foris";

RootPasswordForm.propTypes = {
    formData: PropTypes.shape({
        newRootPassword: PropTypes.string,
        newRootPasswordRepeat: PropTypes.string,
    }).isRequired,
    submitButtonState: PropTypes.oneOf(
        Object.keys(SUBMIT_BUTTON_STATES).map(
            (key) => SUBMIT_BUTTON_STATES[key]
        )
    ).isRequired,
    formErrors: PropTypes.shape({
        newRootPassword: PropTypes.string,
        newRootPasswordRepeat: PropTypes.string,
    }),
    setFormValue: PropTypes.func.isRequired,
    postRootPassword: PropTypes.func.isRequired,
    deviceDetails: PropTypes.object.isRequired,
    disabled: PropTypes.bool,
};

export default function RootPasswordForm({
    formData,
    formErrors,
    setFormValue,
    submitButtonState,
    postRootPassword,
    disabled,
    deviceDetails,
}) {
    if (
        Object.hasOwnProperty.call(deviceDetails, "customization") &&
        deviceDetails.customization === "shield"
    )
        return null;
    return (
        <form onSubmit={postRootPassword}>
            <h3>{_("Advanced Administration Password")}</h3>
            <p
                dangerouslySetInnerHTML={{
                    __html: babel.format(
                        _(
                            `In order to access the advanced configuration options which are not available here, you must
set the root user's password. The advanced configuration options can be managed either 
through the <a href="%s" target="_blank" rel="noopener noreferrer">LuCI web interface</a> or via SSH.`
                        ),
                        ForisURLs.luci
                    ),
                }}
            />
            <PasswordInput
                withEye
                label={_("New password")}
                value={formData.newRootPassword}
                error={formErrors.newRootPassword}
                onChange={setFormValue((value) => ({
                    newRootPassword: { $set: value },
                }))}
                disabled={disabled}
            />
            <PasswordInput
                withEye
                label={_("Confirm new password")}
                value={formData.newRootPasswordRepeat}
                error={formErrors.newRootPasswordRepeat}
                onChange={setFormValue((value) => ({
                    newRootPasswordRepeat: { $set: value },
                }))}
                disabled={disabled}
            />
            <div className="text-right">
                <SubmitButton
                    state={submitButtonState}
                    disabled={
                        !!formErrors.newRootPassword ||
                        !!formErrors.newRootPasswordRepeat
                    }
                />
            </div>
        </form>
    );
}
