/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, {useEffect} from 'react';

import {useAPIGetData, useAPIPostData} from '../api/hooks';
import {useWS, useWSNetworkRestart} from '../webSockets/hooks';
import {FORM_STATES, useForm} from './hooks';
import SubmitButton from './SubmitButton';

export default function ForisForm({prepData, prepDataToSubmit, validator, module, children}) {
    const [
        formData,
        formErrors,
        setFormData,

        formState,
        setFormState,
        formIsDisabled,

        setFormValue
    ] = useForm(prepData, validator);

    const [getData, isReady] = useAPIGetData(module);
    const postData = useAPIPostData(module);
    useEffect(() => getData(data => setFormData(data)), []);
    useEffect(() => {
        if (isReady)
            setFormState(FORM_STATES.READY);
        else
            setFormState(FORM_STATES.LOAD);
    }, [isReady]);

    useWS(module, 'update_settings', () => {
        setFormState(FORM_STATES.UPDATE);
    });

    const remindsToNWRestart = useWSNetworkRestart();
    useEffect(() => {
            if (remindsToNWRestart === 0) {
                getData(data => setFormData(data));
                return;
            }
            setFormState(FORM_STATES.NETWORK_RESTART);
        },
        [remindsToNWRestart]
    );

    if (JSON.stringify(formData) === '{}')
        return null;

    function onSubmit(e) {
        e.preventDefault();
        setFormState(FORM_STATES.UPDATE);
        const copiedFormData = JSON.parse(JSON.stringify(formData));
        postData(prepDataToSubmit(copiedFormData))
    }

    const childrenWithFormProps = React.Children.map(
        children, child =>
            React.cloneElement(child, {
                formData: formData,
                formErrors: formErrors,
                disabled: formIsDisabled,
                setFormValue: setFormValue,
            })
    );

    return <form onSubmit={onSubmit}>
        {childrenWithFormProps}
        <SubmitButton
            disabled={!!formErrors}
            state={formState}
            remindsToNWRestart={remindsToNWRestart}
        />
    </form>
}
