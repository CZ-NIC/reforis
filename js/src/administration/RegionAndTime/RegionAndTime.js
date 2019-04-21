/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, {useEffect} from 'react';
import update from 'immutability-helper';
import moment from 'moment';

import {FORM_STATES, useForm} from '../../forisForm/hooks';
import {useAPIGetData, useAPIPostData} from '../../forisAPI/hooks';

import RegionForm from './forms/RegionForm';
import TimeForm from './forms/TimeForm';
import SubmitButton from '../../forisForm/SubmitButton';

export default function RegionAndTime() {
    const [
        formData,
        formErrors,
        setFormData,

        formState,
        setFormState,

        formIsDisabled,
        setFormValue
    ] = useForm(validator);
    const [getData, isReady] = useAPIGetData('regionAndTime');
    const loadFormData = () => getData(data => setFormData(data));
    useEffect(() => loadFormData(), []);
    useEffect(() => setFormState(isReady ? FORM_STATES.READY : FORM_STATES.LOAD), [isReady,]);

    const postData = useAPIPostData('regionAndTime');

    function postRegionAndTimeData(e) {
        e.preventDefault();
        setFormState(FORM_STATES.UPDATE);
        const copiedFormData = JSON.parse(JSON.stringify(formData));

        delete copiedFormData.time_settings.ntp_servers;
        if (copiedFormData.time_settings.how_to_set_time === 'ntp')
            delete copiedFormData.time_settings.time;
        postData(copiedFormData, () => {
            loadFormData();
        })
    }

    const [getTimeData] = useAPIGetData('time');

    function updateTime() {
        setFormState(FORM_STATES.UPDATE);
        getTimeData(data => {
                setFormData(state => (update(state, {time_settings: {time: {$set: data.time}}})));
                setFormState(FORM_STATES.READY);
            }
        )
    }

    if (!isReady)
        return null;


    return <form onSubmit={postRegionAndTimeData}>
        <h3>{_('Region and time')}</h3>
        <p>{_('It is important for your device to have the correct time set. If your device\'s time is delayed, the ' +
            'procedure of SSL certificate verification might not work correctly.')}</p>
        <RegionForm
            formData={formData}
            setFormValue={setFormValue}
            disabled={formIsDisabled}
        />
        <TimeForm
            formData={formData.time_settings}
            formErrors={formErrors.time_settings}
            setFormValue={setFormValue}
            updateTime={updateTime}
            disabled={formIsDisabled}
        />
        <SubmitButton
            state={formState}
            disabled={!!formErrors.time_settings}
        />
    </form>
}

function validator(formData) {
    if (!moment(formData.time_settings.time).isValid())
        return {time_settings: {time: _('Time should be in YYYY-MM-DD HH:MM:SS format.')}};
    return {}
}
