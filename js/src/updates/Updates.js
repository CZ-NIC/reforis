/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react'
import moment from 'moment';

import UpdatesForm from './forms/UpdatesForm';
import ForisForm from '../formContainer/ForisForm';
import API_URLs from '../common/API';

export default function Updates({postCallback}) {
    return <ForisForm
        forisConfig={{
            endpoint: API_URLs.updates
        }}
        prepData={prepData}
        prepDataToSubmit={prepDataToSubmit}
        postCallback={postCallback}
        validator={validator}
    >
        <UpdatesForm/>
    </ForisForm>
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
