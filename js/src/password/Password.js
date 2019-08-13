/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, {useCallback, useEffect, useState} from 'react';

import {STATES as SUBMIT_BUTTON_STATES} from 'formContainer/SubmitButton';
import {useAPIGet, useAPIPost} from 'common/APIhooks';
import API_URLs from 'common/API';
import {useForm} from 'formContainer/hooks';
import Alert from 'common/bootstrap/Alert';

import CurrentForisPasswordForm from './CurrentForisPasswordForm';
import ForisPasswordForm from './ForisPasswordForm';
import RootPasswordForm from './RootPasswordForm';
import Spinner from 'common/bootstrap/Spinner';


export default function Password({postCallback}) {
    const [formState, onFormChangeHandler, resetFormData] = useForm(validator);

    const resetPasswordForm = useCallback(() => {
        resetFormData({
            currentForisPassword: '',
            newForisPassword: '',
            sameForRoot: false,
            newRootPassword: '',
        })
    }, [resetFormData]);

    useEffect(() => {
        resetPasswordForm();
    }, [resetPasswordForm]);

    const [passwordIsSetState, getPasswordIsSet] = useAPIGet(API_URLs.password);
    useEffect(() => {
        getPasswordIsSet()
    }, [getPasswordIsSet]);

    const [alert, setAlert] = useState(null);
    const [postState, post] = useAPIPost(API_URLs.password);
    useEffect(() => {
        if (postState.data) {
            if (postState.isSuccess) {
                setAlert({type: 'success', message: _('Password was successfully changed')});
                postCallback();
            } else if (postState.isError)
                setAlert({type: 'danger', message: postState.data.error});
            resetPasswordForm();
        }
    }, [postState.isSuccess, postState.isError, resetPasswordForm, postState.data, postCallback]);

    function postForisPassword(e) {
        e.preventDefault();
        setAlert(null);
        let data = {
            foris_current_password: formState.data.currentForisPassword,
            foris_password: formState.data.newForisPassword
        };
        if (formState.data.sameForRoot)
            data['root_password'] = formState.data.newForisPassword;
        post(data)
    }

    function postRootPassword(e) {
        e.preventDefault();
        setAlert(null);
        const data = {
            foris_current_password: formState.data.currentForisPassword,
            root_password: formState.data.newRootPassword
        };
        post(data);
    }

    if (passwordIsSetState.isLoading || !formState.data)
        return <Spinner className='row justify-content-center'/>;

    const disabled = postState.isSending;
    const submitButtonState = postState.isSending ? SUBMIT_BUTTON_STATES.SAVING : SUBMIT_BUTTON_STATES.READY;

    return <>
        {alert ? <Alert type={alert.type} message={alert.message} onDismiss={() => setAlert(null)}/> : null}
        <h1>{_('Password')}</h1>
        <h3>{_('Password settings')}</h3>
        {passwordIsSetState.data.password_set ?
            <CurrentForisPasswordForm
                formData={formState.data}
                disabled={disabled}
                setFormValue={onFormChangeHandler}
            />
            : null}
        <ForisPasswordForm
            formData={formState.data}
            formErrors={formState.errors}
            submitButtonState={submitButtonState}
            disabled={disabled}

            setFormValue={onFormChangeHandler}
            postForisPassword={postForisPassword}
        />
        {!formState.data.sameForRoot ?
            <RootPasswordForm
                formData={formState.data}
                formErrors={formState.errors}
                submitButtonState={submitButtonState}
                disabled={disabled}

                setFormValue={onFormChangeHandler}
                postRootPassword={postRootPassword}
            />
            : null}
    </>
}

function validator(formData) {
    const errors = {
        newForisPassword: validatePassword(formData.newForisPassword),
        newRootPassword: !formData.sameForRoot ? validatePassword(formData.newRootPassword) : null,
    };

    if (errors.newForisPassword || errors.newRootPassword)
        return errors;
    return {}
}

function validatePassword(password) {
    if (password === '')
        return _('Password can\'t be empty.');

    if (password.length < 6)
        return _('Password should have min 6 symbols.');

    if (password.length > 128)
        return _('Password should have max 128 symbols.');

    return null
}
