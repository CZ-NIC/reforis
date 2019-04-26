/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, {useEffect} from 'react';

import {FORM_STATES, useForm} from '../forisForm/hooks';
import {useAPIGetData, useAPIPostData} from '../forisAPI/hooks';
import SubmitButton from '../forisForm/SubmitButton';
import Alert from '../bootstrap/Alert';

import LanguageForm from './forms/LanguageForm';
import PackagesForm from './forms/PackagesForm';

export default function Packages() {
    const [
        formData,
        ,
        setFormData,
        formState,
        setFormState,

        formIsDisabled,
        setFormValue
    ] = useForm(()=>{});

    const [getData, isReady] = useAPIGetData('packages');
    const loadFormData = () => getData(data => setFormData(data));
    useEffect(() => loadFormData(), []);
    useEffect(() => setFormState(isReady ? FORM_STATES.READY : FORM_STATES.LOAD), [isReady,]);

    const postData = useAPIPostData('packages');

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
        {!formData.enabled ?
            <Alert
                type='warning'
                message={_('Please enable automatic updates to manage packages and languages.')}
            />
            : null}
        <div className={!formData.enabled ? 'text-muted' : null}>
            <PackagesForm
                formData={formData.user_lists}
                setFormValue={setFormValue}
                disabled={formIsDisabled || !formData.enabled}
            />
            <LanguageForm
                formData={formData.languages}
                setFormValue={setFormValue}
                disabled={formIsDisabled || !formData.enabled}
            />
            <SubmitButton state={formState} disabled={!formData.enabled}/>
        </div>
    </form>
}

function prepDataToSubmit(formDate) {
    const packages = formDate.user_lists
        .filter(_package => _package.enabled)
        .map(_package => _package.name);

    const languages = formDate.languages
        .filter(language => language.enabled)
        .map(language => language.code);

    return {languages: languages, user_lists: packages}
}
