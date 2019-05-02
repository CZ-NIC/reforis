/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, {useState, useEffect} from 'react';

import {useAPIGetData, useAPIPostData} from '../../common/APIhooks';
import {APIEndpoints} from '../../common/API';
import {FORM_STATES, useForm} from '../../formContainer/hooks';
import Alert from '../../common/bootstrap/Alert';

import CurrentForisPasswordForm from './CurrentForisPasswordForm';
import ForisPasswordForm from './ForisPasswordForm';
import RootPasswordForm from './RootPasswordForm';
import validator from './validator';


function usePasswordIsSet() {
    const [isSet, setIsSet] = useState(null);
    const [getData, isReady] = useAPIGetData(APIEndpoints.password);
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

    const postData = useAPIPostData(APIEndpoints.password);

    function postForisPassword(e) {
        e.preventDefault();
        let data = {
            foris_current_password: formData.currentForisPassword,
            foris_password: formData.newForisPassword
        };
        if (formData.sameForRoot)
            data['root_password'] = formData.newForisPassword;
        postPasswordData(data)
    }

    function postRootPassword(e) {
        e.preventDefault();
        const data = {
            foris_current_password: formData.currentForisPassword,
            root_password: formData.newRootPassword
        };
        postPasswordData(data);
    }

    function postPasswordData(data) {
        postData(data, () => processResultSuccess(), error => processResultFail(error.response.data))
    }

    function processResultSuccess() {
        setAlert({
            type: 'success',
            message: _('Password was successfully changed')
        });
        setFormData(initialFormData)
    }

    function processResultFail(res) {
        setAlert({type: 'danger', message: res.error});
        setFormData(data => ({...data, currentForisPassword: ''}))
    }

    if (!isReady)
        return null;

    return <>
        {alert ? <Alert type={alert.type} message={alert.message} onDismiss={() => setAlert(null)}/> : null}
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


