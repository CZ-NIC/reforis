/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useCallback, useEffect } from "react";
import PropTypes from "prop-types";

import {
    SUBMIT_BUTTON_STATES,
    useForm,
    useAPIGet,
    useAPIPost,
    API_STATE,
    useAlert,
    ALERT_TYPES,
    withErrorMessage,
    withSpinnerOnSending,
    formFieldsSize,
} from "foris";

import API_URLs from "common/API";

import CurrentForisPasswordForm from "./CurrentForisPasswordForm";
import ForisPasswordForm from "./ForisPasswordForm";
import RootPasswordForm from "./RootPasswordForm";

Password.propTypes = {
    postCallback: PropTypes.func,
};

Password.defaultProps = {
    postCallback: () => undefined,
};

export default function Password({ postCallback }) {
    const [getPasswordResponse, getPassword] = useAPIGet(API_URLs.password);
    useEffect(() => {
        getPassword();
    }, [getPassword]);

    return (
        <>
            <h1>{_("Password")}</h1>
            <PasswordFormWithErrorAndSpinner
                apiState={getPasswordResponse.state}
                currentPassword={getPasswordResponse.data || {}}
                postCallback={postCallback}
            />
        </>
    );
}

PasswordForm.propTypes = {
    postCallback: PropTypes.func.isRequired,
    currentPassword: PropTypes.object.isRequired,
};

function PasswordForm({ postCallback, currentPassword }) {
    const [formState, onFormChangeHandler, resetFormData] = useForm(validator);

    const resetPasswordForm = useCallback(() => {
        resetFormData({
            currentForisPassword: "",
            newForisPassword: "",
            sameForRoot: false,
            newRootPassword: "",
        });
    }, [resetFormData]);

    useEffect(() => {
        resetPasswordForm();
    }, [resetPasswordForm]);

    const [setAlert, dismissAlert] = useAlert();
    const [postState, post] = useAPIPost(API_URLs.password);
    useEffect(() => {
        if (postState.data) {
            const forisPassword = postState.data.foris_password
                ? postState.data.foris_password
                : false;
            const rootPassword = postState.data.root_password
                ? postState.data.root_password
                : false;
            if (
                postState.state === API_STATE.SUCCESS &&
                (forisPassword.result === false ||
                    rootPassword.result === false)
            ) {
                setAlert(
                    _(
                        `The password you've entered has been compromised. It appears ${
                            forisPassword.count || rootPassword.count
                        } times in ${
                            forisPassword.list || rootPassword.list
                        } list.`
                    ),
                    ALERT_TYPES.ERROR
                );
                postCallback();
            } else if (postState.state === API_STATE.SUCCESS) {
                setAlert(
                    _("Password changed successfully."),
                    ALERT_TYPES.SUCCESS
                );
                postCallback();
            } else if (postState.state === API_STATE.ERROR) {
                setAlert(postState.data);
            }
            resetPasswordForm();
        }
    }, [postState, resetPasswordForm, postCallback, setAlert]);

    if (!formState.data) {
        return null;
    }

    function postForisPassword(event) {
        event.preventDefault();
        dismissAlert();
        const data = {
            foris_current_password: formState.data.currentForisPassword,
            foris_password: formState.data.newForisPassword,
        };
        if (formState.data.sameForRoot)
            data.root_password = formState.data.newForisPassword;
        post({ data });
    }

    function postRootPassword(event) {
        event.preventDefault();
        dismissAlert();
        const data = {
            foris_current_password: formState.data.currentForisPassword,
            root_password: formState.data.newRootPassword,
        };
        post({ data });
    }

    const isSending = postState === API_STATE.SENDING;
    const submitButtonState = isSending
        ? SUBMIT_BUTTON_STATES.SAVING
        : SUBMIT_BUTTON_STATES.READY;

    return (
        <div className={formFieldsSize}>
            <h3>{_("Password Settings")}</h3>
            {currentPassword.password_set && (
                <CurrentForisPasswordForm
                    formData={formState.data}
                    disabled={isSending}
                    setFormValue={onFormChangeHandler}
                />
            )}
            <ForisPasswordForm
                formData={formState.data}
                formErrors={formState.errors}
                submitButtonState={submitButtonState}
                disabled={isSending}
                setFormValue={onFormChangeHandler}
                postForisPassword={postForisPassword}
            />
            {!formState.data.sameForRoot && (
                <RootPasswordForm
                    formData={formState.data}
                    formErrors={formState.errors}
                    submitButtonState={submitButtonState}
                    disabled={isSending}
                    setFormValue={onFormChangeHandler}
                    postRootPassword={postRootPassword}
                />
            )}
        </div>
    );
}

function validator(formData) {
    const errors = {
        newForisPassword: validatePassword(formData.newForisPassword),
        newRootPassword: !formData.sameForRoot
            ? validatePassword(formData.newRootPassword)
            : null,
    };

    if (errors.newForisPassword || errors.newRootPassword) return errors;
    return {};
}

function validatePassword(password) {
    if (password === "") return _("Password can't be empty.");

    if (password.length < 6) return _("Password should have min 6 symbols.");

    if (password.length > 128)
        return _("Password should have max 128 symbols.");

    return null;
}

const PasswordFormWithErrorAndSpinner = withSpinnerOnSending(
    withErrorMessage(PasswordForm)
);
