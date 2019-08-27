/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import { ForisURLs } from "common/constants";
import { PasswordInput } from "foris";
import SubmitButton, { STATES as SUBMIT_BUTTON_STATES } from "form/SubmitButton";

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
};

export default function RootPasswordForm({
    formData, formErrors, setFormValue, submitButtonState, postRootPassword, ...props
}) {
    return (
        <form onSubmit={postRootPassword}>
            <h4>{_("Advanced administration (root) password")}</h4>
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

                {...props}
            />
            <SubmitButton
                state={submitButtonState}
                disabled={!!formErrors.newRootPassword}
            />
        </form>
    );
}
