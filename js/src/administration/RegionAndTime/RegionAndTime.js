/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import moment from 'moment';


import RegionForm from './RegionForm';
import TimeForm from './TimeForm';
import ForisForm from '../../formContainer/ForisForm';

import {APIEndpoints} from '../../common/API';

export default function RegionAndTime() {
    return <>
        <h3>{_('Region and time')}</h3>
        <p>{_('It is important for your device to have the correct time set. If your device\'s time is delayed, the ' +
            'procedure of SSL certificate verification might not work correctly.')}</p>
        <ForisForm
            forisConfig={{
                endpoint: APIEndpoints.regionAndTime
            }}
            prepDataToSubmit={prepDataToSubmit}
            validator={validator}
        >
            <RegionForm/>
            <TimeForm/>
        </ForisForm>
    </>
}

function validator(formData) {
    if (!moment(formData.time_settings.time).isValid())
        return {time_settings: {time: _('Time should be in YYYY-MM-DD HH:MM:SS format.')}};
    return undefined;
}

function prepDataToSubmit(formData) {
    delete formData.time_settings.ntp_servers;
    if (formData.time_settings.how_to_set_time === 'ntp')
        delete formData.time_settings.time;
    return formData
}
