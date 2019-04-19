/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, {useState, useEffect} from 'react';

import {useAPIGetData, useAPIPostData} from '../../forisAPI/hooks';
import {FORM_STATES, useForm} from '../../forisForm/hooks';
import Alert from '../../bootstrap/Alert';
import CurrentForisPasswordForm from './forms/CurrentForisPasswordForm';
import ForisPasswordForm from './forms/ForisPasswordForm';
import RootPasswordForm from './forms/RootPasswordForm';
import validator from './validator';


function usePasswordIsSet() {
    const [isSet, setIsSet] = useState(null);
    const [getData, isReady] = useAPIGetData('password');
    useEffect(() => {
        getData(data => setIsSet(data['password_set']))
    }, []);
    return [isSet, isReady]
}

export default function Password() {
    const [
        formData,
        formErrors,
        setFormData,

        formState,
        setFormState,

        formIsDisabled,
        setFormValue] = useForm(validator);
    const initialFormData = {
        currentForisPassword: '',
        newForisPassword: '',
        sameForRoot: false,
        newRootPassword: '',
    };
    useEffect(() => {
        setFormData(initialFormData);
        setFormState(FORM_STATES.READY);
    }, []);

    const [passwordIsSet, isReady] = usePasswordIsSet();

    const [alert, setAlert] = useState(null);

    function processRequestResult(res) {
        if (res.error) {
            setAlert({type: 'danger', message: res.error});
            setFormData(data => ({...data, currentForisPassword: ''}))
        } else {
            setAlert({
                type: 'success',
                message: _('Password was successfully changed')
            });
            setFormData(initialFormData)
        }
    }

    const postData = useAPIPostData('password');

    function postForisPassword(e) {
        e.preventDefault();
        let data = {
            foris_current_password: formData.currentForisPassword,
            foris_password: formData.newForisPassword
        };
        if (formData.sameForRoot)
            data['root_password'] = formData.newForisPassword;
        postData(data, res => {
            processRequestResult(res)
        })
    }

    function postRootPassword(e) {
        e.preventDefault();
        postData({
            foris_current_password: formData.currentForisPassword,
            root_password: formData.newRootPassword
        }, res => {
            processRequestResult(res)
        })
    }

    function onAlertDismiss() {
        setAlert(null);
    }
    if (!isReady)
        return null;

    return <>
        {alert ? <Alert type={alert.type} message={alert.message} onDismiss={onAlertDismiss}/> : null}
        <h3>{_('Password settings')}</h3>
        {passwordIsSet ?
            <CurrentForisPasswordForm
                formData={formData}
                disabled={formIsDisabled}
                setFormValue={setFormValue}
            />
            : null}
        <ForisPasswordForm
            formData={formData}
            formErrors={formErrors}
            formState={formState}
            disabled={formIsDisabled}

            setFormValue={setFormValue}
            postForisPassword={postForisPassword}
        />
        {!formData.sameForRoot ?
            <RootPasswordForm
                formData={formData}
                formErrors={formErrors}
                formState={formState}
                disabled={formIsDisabled}

                setFormValue={setFormValue}
                postRootPassword={postRootPassword}
            />
            : null}
    </>
}


