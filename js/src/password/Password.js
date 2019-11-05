/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useCallback, useEffect } from "react";
import PropTypes from "prop-types";

import {
    SUBMIT_BUTTON_STATES, useForm, Spinner, useAPIGet, useAPIPost, API_STATE, useAlert, ALERT_TYPES,
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

    const [passwordIsSetState, getPasswordIsSet] = useAPIGet(API_URLs.password);
    useEffect(() => {
        getPasswordIsSet();
    }, [getPasswordIsSet]);

    const [setAlert, dismissAlert] = useAlert();
    const [postState, post] = useAPIPost(API_URLs.password);
    useEffect(() => {
        if (postState.data) {
            if (postState.state === API_STATE.SUCCESS) {
                setAlert(_("Password changed successfully"), ALERT_TYPES.SUCCESS);
                postCallback();
            } else if (postState.state === API_STATE.ERROR) {
                setAlert(postState.data);
            }
            resetPasswordForm();
        }
    }, [postState, resetPasswordForm, postCallback, setAlert]);

    function postForisPassword(event) {
        event.preventDefault();
        dismissAlert();
        const data = {
            foris_current_password: formState.data.currentForisPassword,
            foris_password: formState.data.newForisPassword,
        };
        if (formState.data.sameForRoot) data.root_password = formState.data.newForisPassword;
        post(data);
    }

    function postRootPassword(event) {
        event.preventDefault();
        dismissAlert();
        const data = {
            foris_current_password: formState.data.currentForisPassword,
            root_password: formState.data.newRootPassword,
        };
        post(data);
    }

    if (passwordIsSetState.state === API_STATE.SENDING || !formState.data) {
        return <Spinner className="row justify-content-center" />;
    }

    const isProcessing = postState === API_STATE.SENDING;
    const submitButtonState = isProcessing
        ? SUBMIT_BUTTON_STATES.SAVING
        : SUBMIT_BUTTON_STATES.READY;

    return (
        <>
            <h1>{_("Password")}</h1>
            <h3>{_("Password settings")}</h3>
            {passwordIsSetState.data.password_set && (
                <CurrentForisPasswordForm
                    formData={formState.data}
                    disabled={isProcessing}
                    setFormValue={onFormChangeHandler}
                />
            )}
            <ForisPasswordForm
                formData={formState.data}
                formErrors={formState.errors}
                submitButtonState={submitButtonState}
                disabled={isProcessing}

                setFormValue={onFormChangeHandler}
                postForisPassword={postForisPassword}
            />
            {!formState.data.sameForRoot && (
                <RootPasswordForm
                    formData={formState.data}
                    formErrors={formState.errors}
                    submitButtonState={submitButtonState}
                    disabled={isProcessing}

                    setFormValue={onFormChangeHandler}
                    postRootPassword={postRootPassword}
                />
            )}
        </>
    );
}

function validator(formData) {
    const errors = {
        newForisPassword: validatePassword(formData.newForisPassword),
        newRootPassword: !formData.sameForRoot ? validatePassword(formData.newRootPassword) : null,
    };

    if (errors.newForisPassword || errors.newRootPassword) return errors;
    return {};
}

function validatePassword(password) {
    if (password === "") return _("Password can't be empty.");

    if (password.length < 6) return _("Password should have min 6 symbols.");

    if (password.length > 128) return _("Password should have max 128 symbols.");

    return null;
}
