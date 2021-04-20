/*
 * Copyright (C) 2020-2021 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useState } from "react";
import PropTypes from "prop-types";

import {
    PasswordInput,
    CheckBox,
    SubmitButton,
    SUBMIT_BUTTON_STATES,
} from "foris";

ForisPasswordForm.propTypes = {
    formData: PropTypes.shape({
        currentForisPassword: PropTypes.string,
        newForisPassword: PropTypes.string,
        newForisPasswordRepeat: PropTypes.string,
        sameForRoot: PropTypes.bool,
    }).isRequired,
    submitButtonState: PropTypes.oneOf(
        Object.keys(SUBMIT_BUTTON_STATES).map(
            (key) => SUBMIT_BUTTON_STATES[key]
        )
    ).isRequired,
    formErrors: PropTypes.shape({
        newForisPassword: PropTypes.string,
        newForisPasswordRepeat: PropTypes.string,
    }),
    setFormValue: PropTypes.func.isRequired,
    postForisPassword: PropTypes.func.isRequired,
    passwordSet: PropTypes.bool.isRequired,
    customization: PropTypes.bool.isRequired,
    disabled: PropTypes.bool,
};

export default function ForisPasswordForm({
    formData,
    formErrors,
    setFormValue,
    submitButtonState,
    postForisPassword,
    disabled,
    passwordSet,
    customization,
}) {
    const [errorFeedbackNew, setErrorFeedbackNew] = useState(false);
    const [errorFeedbackConf, setErrorFeedbackConf] = useState(false);
    return (
        <>
            <p>{_("Set your password for this administration interface.")}</p>
            <form onSubmit={postForisPassword} className="mb-3 mb-md-0">
                {passwordSet && (
                    <PasswordInput
                        withEye
                        label={_("Current password")}
                        value={formData.currentForisPassword}
                        onChange={setFormValue((value) => ({
                            currentForisPassword: { $set: value },
                        }))}
                        disabled={disabled}
                    />
                )}
                <PasswordInput
                    withEye
                    label={_("New password")}
                    value={formData.newForisPassword}
                    error={errorFeedbackNew ? formErrors.newForisPassword : ""}
                    onChange={setFormValue((value) => ({
                        newForisPassword: { $set: value },
                    }))}
                    onFocus={() => setErrorFeedbackNew(true)}
                    disabled={disabled}
                />

                <PasswordInput
                    withEye
                    label={_("Confirm new password")}
                    value={formData.newForisPasswordRepeat}
                    error={
                        errorFeedbackConf
                            ? formErrors.newForisPasswordRepeat
                            : ""
                    }
                    onChange={setFormValue((value) => ({
                        newForisPasswordRepeat: { $set: value },
                    }))}
                    onFocus={() => setErrorFeedbackConf(true)}
                    disabled={disabled}
                />

                {!customization && (
                    <CheckBox
                        label={_(
                            "Use the same password for advanced administration (root)"
                        )}
                        helpText={_(
                            "Same password would be used for accessing this administration interface, for root user in " +
                                "LuCI web interface and for SSH login. Use a strong password! (If you choose not to set the password " +
                                "for advanced configuration here, you will have the option to do so later. Until then, the root account " +
                                "will be blocked.)"
                        )}
                        checked={formData.sameForRoot}
                        onChange={setFormValue((value) => ({
                            sameForRoot: { $set: value },
                        }))}
                        disabled={disabled}
                    />
                )}
                <div className="text-right">
                    <SubmitButton
                        state={submitButtonState}
                        disabled={
                            !!formErrors.newForisPassword ||
                            !!formErrors.newForisPasswordRepeat
                        }
                        onClick={() => setErrorFeedbackNew(false)}
                    />
                </div>
            </form>
        </>
    );
}
