/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react'

import WiFiForm from './WiFiForm';
import ForisForm from '../forisForm/ForisForm';

export default function WiFi({ws}) {
    return <ForisForm
        ws={ws}
        module='wifi'
        prepData={data => data}
        prepDataToSubmit={prepDataToSubmit}
        validator={validator}
    >
        <WiFiForm/>
    </ForisForm>

}

const validator = formData => {
    const errors = formData.devices.map(
        (device) => {
            if (!device.enabled) return {};

            let errors = {};
            if (device.SSID.length > 32)
                errors.SSID = _("SSID can't be longer than 32 symbols");
            if (device.SSID.length === 0)
                errors.SSID = _("SSID can't be empty");

            if (device.password.length < 8)
                errors.password = _('Password must contain at least 8 symbols');

            if (!device.guest_wifi.enabled) return errors;
            if (device.guest_wifi.password.length < 8)
                errors.guest_wifi = {
                    password: _('Password must contain at least 8 symbols')
                };


            return errors;
        });
    return JSON.stringify(errors) === '[{},{}]' ? null : errors
};

function prepDataToSubmit(formData) {
    formData.devices.forEach((device, idx) => {
        delete device['available_bands'];

        formData.devices[idx].channel = parseInt(device.channel);

        if (!device.enabled) {
            formData.devices[idx] = {id: device.id, enabled: false};
            return;
        }

        if (!device.guest_wifi.enabled)
            formData.devices[idx].guest_wifi = {enabled: false};
    });
    return formData;
}
