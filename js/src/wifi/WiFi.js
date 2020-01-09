/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import { WiFiSettings } from "foris";
import API_URLs from "common/API";

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
            <WiFiSettings
                ws={ws}
                endpoint={API_URLs.wifi}
                resetEndpoint={API_URLs.wifiReset}
            />
        </>
    );
}
