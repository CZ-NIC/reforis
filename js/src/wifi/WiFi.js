/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react'
import propTypes from 'prop-types';

import WiFiForm from './WiFiForm';
import ForisForm from '../formContainer/ForisForm';
import API_URLs from '../common/API';

WiFi.propTypes = {
    ws: propTypes.object.isRequired
};

export default function WiFi({ws}) {
    return <ForisForm
        ws={ws}
        forisConfig={{
            endpoint: API_URLs.wifi,
            wsModule: 'wifi',
        }}
        prepDataToSubmit={prepDataToSubmit}
        validator={validator}
    >
        <WiFiForm/>
    </ForisForm>
}

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

            let guest_wifi_errors = {};
            if (device.guest_wifi.SSID.length > 32)
                guest_wifi_errors.SSID = _("SSID can't be longer than 32 symbols");
            if (device.guest_wifi.SSID.length === 0)
                guest_wifi_errors.SSID = _("SSID can't be empty");

            if (device.guest_wifi.password.length < 8)
                guest_wifi_errors.password = _('Password must contain at least 8 symbols');

            if (guest_wifi_errors.SSID || guest_wifi_errors.password)
                errors.guest_wifi = guest_wifi_errors;
            return errors;
        });
    return JSON.stringify(errors) === '[{},{}]' ? null : errors
};
