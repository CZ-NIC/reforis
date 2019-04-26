/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, {useEffect} from 'react'
import moment from 'moment';

import {useForm} from '../forisForm/hooks';
import {useAPIGetData, useAPIPostData} from '../forisAPI/hooks';
import SubmitButton from '../forisForm/SubmitButton';

import UpdatesForm from './forms/UpdatesForm';

const FORM_STATES = {
    READY: 0,
    UPDATE: 1,
    LOAD: 2,
};

export default function Updates() {
    const [
        formData,
        formErrors,
        setFormData,
        formState,
        setFormState,

        formIsDisabled,
        setFormValue
    ] = useForm(validator);

    const [getData, isReady] = useAPIGetData('updates');
    const loadFormData = () => getData(data => setFormData(prepData(data)));
    useEffect(() => loadFormData(), []);
    useEffect(() => setFormState(isReady ? FORM_STATES.READY : FORM_STATES.LOAD), [isReady,]);

    const postData = useAPIPostData('updates');

    function onSubmitHandler(e) {
        e.preventDefault();
        setFormState(FORM_STATES.UPDATE);
        const copiedFormData = JSON.parse(JSON.stringify(formData));
        postData(prepDataToSubmit(copiedFormData), () => {
            loadFormData();
        });
    }

    if (!isReady)
        return null;

    return <form onSubmit={onSubmitHandler}>
        <UpdatesForm
            formData={formData}
            formErrors={formErrors}
            setFormValue={setFormValue}
            disabled={formIsDisabled}
        />
        <SubmitButton state={formState}/>
    </form>
}


function prepData(formData) {
    if (!formData.approval_settings.delay)
        formData.approval_settings.delay = 1;
    return formData
}

function prepDataToSubmit(formData) {
    if (!formData.enabled) {
        delete formData.approval_settings;
        delete formData.languages;
        delete formData.user_lists;
    } else if (formData.approval_settings.status !== 'delayed')
        delete formData.approval_settings.delay;
    return formData
}

function validator(formData) {
    let rebootErrors = {};
    if (!moment(formData.reboots.time, 'HH:mm', true).isValid())
        rebootErrors.time = _('Time should be in HH:MM format.');
    if (0 > formData.reboots.delay || formData.reboots.delay > 10)
        rebootErrors.delay = _('Number of days that must pass between receiving the request for restart and the automatic restart itself.');
    return rebootErrors.time || rebootErrors.delay ? {reboots: rebootErrors} : undefined;
}
