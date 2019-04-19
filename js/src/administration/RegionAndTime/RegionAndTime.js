/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, {useEffect} from 'react';
import {FORM_STATES, useForm} from '../../forisForm/hooks';
import {useAPIGetData} from '../../forisAPI/hooks';
import RegionForm from './forms/RegionForm';

export default function RegionAndTime() {
    const [
        formData,
        formErrors,
        setFormData,

        formState,
        setFormState,

        formIsDisabled,
        setFormValue
    ] = useForm(data => data);
    const [getData, isReady] = useAPIGetData('regionAndTime');
    const loadFormData = () => getData(data => setFormData(data));
    useEffect(() => loadFormData(), []);
    useEffect(() => setFormState(isReady ? FORM_STATES.READY : FORM_STATES.LOAD), [isReady,]);
    return <>
        <h3>{_('Region and time')}</h3>
        <RegionForm
            formData={}
            setFormValue={}
        />
        {/*<TimeForm*/}
        {/*/>*/}
    </>
}
