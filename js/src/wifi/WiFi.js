/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import { ForisForm } from "foris";
import API_URLs from "common/API";

import WiFiForm from "./WiFiForm";
import ResetWiFiSettings from "./ResetWiFiSettings";

const validator = (formData) => {
    const formErrors = formData.devices.map(
        (device) => {
            if (!device.enabled) return {};

            const errors = {};
            if (device.SSID.length > 32) errors.SSID = _("SSID can't be longer than 32 symbols");
            if (device.SSID.length === 0) errors.SSID = _("SSID can't be empty");

            if (device.password.length < 8) errors.password = _("Password must contain at least 8 symbols");

            if (!device.guest_wifi.enabled) return errors;

            const guest_wifi_errors = {};
            if (device.guest_wifi.SSID.length > 32) guest_wifi_errors.SSID = _("SSID can't be longer than 32 symbols");
            if (device.guest_wifi.SSID.length === 0) guest_wifi_errors.SSID = _("SSID can't be empty");

            if (device.guest_wifi.password.length < 8) guest_wifi_errors.password = _("Password must contain at least 8 symbols");

            if (guest_wifi_errors.SSID || guest_wifi_errors.password) {
                errors.guest_wifi = guest_wifi_errors;
            }
            return errors;
        },
    );
    return JSON.stringify(formErrors) === "[{},{}]" ? null : formErrors;
};

WiFi.propTypes = {
    ws: PropTypes.object.isRequired,
};

export default function WiFi({ ws }) {
    return (
        <>
            <h1>{_("Wi-Fi")}</h1>
            <p>
                {_(`
If you want to use your router as a Wi-Fi access point, enable Wi-Fi here and fill in an SSID (the name of the access 
point) and a corresponding password. You can then set up your mobile devices, using the QR code available within the form.
            `)}
            </p>
            <ForisForm
                ws={ws}
                forisConfig={{
                    endpoint: API_URLs.wifi,
                    wsModule: "wifi",
                }}
                prepData={prepData}
                prepDataToSubmit={prepDataToSubmit}
                validator={validator}
            >
                <WiFiForm />
            </ForisForm>
            <ResetWiFiSettings ws={ws} />
        </>
    );
}

function prepData(formData) {
    formData.devices.forEach((device, idx) => {
        formData.devices[idx].channel = device.channel.toString();
    });
    return formData;
}

function prepDataToSubmit(formData) {
    formData.devices.forEach((device, idx) => {
        delete device.available_bands;

        formData.devices[idx].channel = parseInt(device.channel);

        if (!device.enabled) {
            formData.devices[idx] = { id: device.id, enabled: false };
            return;
        }

        if (!device.guest_wifi.enabled) formData.devices[idx].guest_wifi = { enabled: false };
    });
    return formData;
}
