/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';

import {FORM_STATES} from '../../../forisForm/hooks';
import ForisForm from '../../../forisForm/ForisForm';

import NotificationsEmailSettingsForm from './forms/NotificationsEmailSettingsForm';
import validator from './validator';

export default function NotificationsEmailSettings({ws}) {
    const module = 'router_notifications';

    // The notifications email setting has different WS notifications action, moreover it should be updated after
    // getting update_email_settings notification.
    function notificationsEmailSettingWSLogic(setFormState, loadData) {
        ws.subscribe(module)
            .bind(module, 'update_email_settings', () => {
                setFormState(FORM_STATES.UPDATE);
                loadData()
            });
    }

    return <>
        <ForisForm
            ws={ws}
            module={module}
            prepData={prepData}
            prepDataToSubmit={prepDataToSubmit}
            validator={validator}
            anotherWSLogic={notificationsEmailSettingWSLogic}
        >
            <NotificationsEmailSettingsForm/>
        </ForisForm>
    </>
}

function prepData(formData) {
    formData = formData.emails;
    formData.common.to = formData.common.to.join(', ');
    return formData
}

function prepDataToSubmit(formData) {
    if (!formData.enabled) return {enabled: false};
    formData.common.to = formData.common.to.replace(/\s+/g, '').split(',');

    if (formData.smtp_type === 'turris')
        delete formData.smtp_custom;
    else if (formData.smtp_type === 'custom')
        delete formData.smtp_turris;
    return formData
}

