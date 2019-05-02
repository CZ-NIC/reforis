/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, {useState, useEffect} from 'react';
import update from 'immutability-helper';

import {useAPIGetData, useAPIPostData} from '../common/APIhooks';

export const FORM_STATES = {
    READY: 0,
    UPDATE: 1,
    LOAD: 2,
};

export function useForm(validator) {
    const [formState, setFormState] = useState(FORM_STATES.LOAD);
    const [formData, setFormData] = useState({});
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        // Do not validate if data isn't received yet.
        if (JSON.stringify(formData) !== '{}')
            setFormErrors(validator(formData))
    }, [formData]);

    function setFormValue(updateRule) {
        return event => {
            const value = getChangedValue(event.target);
            const newData = update(formData, updateRule(value));
            setFormData(newData);
        };
    }

    function isDisabled() {
        return formState !== FORM_STATES.READY;
    }

    return [
        formData,
        formErrors,
        setFormData,
        formState,
        setFormState,

        isDisabled(),
        setFormValue,
    ]
}

function getChangedValue(target) {
    let value = target.value;
    if (target.type === 'checkbox')
        value = target.checked;
    else if (target.type === 'number') {
        const parsedValue = parseInt(value);
        value = isNaN(parsedValue) ? value : parsedValue;
    }
    return value
}

export function useForisForm(ws, forisConfig, prepData, prepDataToSubmit, validator) {
    const [
        formData,
        formErrors,
        setFormData,
        formState,
        setFormState,

        formIsDisabled,
        setFormValue
    ] = useForm(validator);
    const [getData, isReady] = useAPIGetData(forisConfig.endpoint);
    const loadFormData = () => getData(data => setFormData(prepData(data)));
    useEffect(() => loadFormData(), []);
    useEffect(() => setFormState(isReady ? FORM_STATES.READY : FORM_STATES.LOAD), [isReady,]);
    useEffect(() => {
        if (!ws)
            return;
        ws.subscribe(forisConfig.wsModule)
            .bind(
                forisConfig.wsModule,
                forisConfig.wsAction ? forisConfig.wsAction : 'update_settings',
                () => {
                    setFormState(FORM_STATES.UPDATE);
                    loadFormData();
                });
    }, []);

    const postData = useAPIPostData(forisConfig.endpoint);

    function onSubmit(e) {
        e.preventDefault();
        setFormState(FORM_STATES.UPDATE);
        const copiedFormData = JSON.parse(JSON.stringify(formData));
        postData(prepDataToSubmit(copiedFormData), () => loadFormData());
    }

    return [
        formData,
        formErrors,
        formState,
        formIsDisabled,

        setFormValue,
        onSubmit
    ]
}