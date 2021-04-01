/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import update from "immutability-helper";
import PropTypes from "prop-types";

import { ForisForm } from "foris";
import API_URLs from "common/API";
import ConnectionTest from "connectionTest/ConnectionTest";

import WAN6Form, { validateWAN6Form } from "./WAN6Form";
import MACForm, { validateMACForm } from "./MACForm";
import WANForm, { validateWANForm } from "./WANForm";

WAN.propTypes = {
    ws: PropTypes.object.isRequired,
};

export default function WAN({ ws }) {
    return (
        <>
            <h1>{_("WAN")}</h1>
            <p>
                {_(`
Here you specify your WAN port settings. Usually, you can leave these options untouched unless instructed
otherwise by your internet service provider. Also, in case there is a cable or DSL modem connecting your
router to the network, it is usually not necessary to change this setting.
        `)}
            </p>
            <ForisForm
                ws={ws}
                forisConfig={{
                    endpoint: API_URLs.wan,
                    wsModule: "wan",
                }}
                prepData={prepData}
                prepDataToSubmit={prepDataToSubmit}
                validator={validator}
            >
                <WANForm />
                <WAN6Form />
                <MACForm />
            </ForisForm>

            <h2>{_("Connection Test")}</h2>
            <p
                dangerouslySetInnerHTML={{
                    __html: _(`
Here you can test you connection settings. Remember to click on the <b>Save button</b> before running the test.
Note that sometimes it takes a while before the connection is fully initialized. So it might be useful to
wait for a while before running this test.
        `),
                }}
            />
            <ConnectionTest ws={ws} type="wan" />
        </>
    );
}

function prepData(formData) {
    // Create empty form fields if nothing has got from the server.
    const wan6_6in4 = update((formData.wan6_settings || {}).wan6_6in4 || {}, {
        dynamic_ipv4: {
            $set: ((formData.wan6_settings || {}).wan6_6in4 || {})
                .dynamic_ipv4 || { enabled: false },
        },
    });
    if (formData.wan_settings.wan_type === "none")
        formData.wan_settings.wan_type = "dhcp";
    return update(formData, {
        wan_settings: {
            wan_dhcp: { $set: formData.wan_settings.wan_dhcp || {} },
            wan_static: { $set: formData.wan_settings.wan_static || {} },
            wan_pppoe: { $set: formData.wan_settings.wan_pppoe || {} },
        },
        wan6_settings: {
            wan6_dhcpv6: {
                $set: formData.wan6_settings.wan6_dhcpv6 || { duid: "" },
            },
            wan6_static: { $set: formData.wan6_settings.wan6_static || {} },
            wan6_6to4: { $set: formData.wan6_settings.wan6_6to4 || {} },
            wan6_6in4: { $set: wan6_6in4 },
        },
    });
}

function prepDataToSubmit(formData) {
    const dataToSubmit = {
        wan_settings: deleteUnnecessarySettings(
            formData.wan_settings.wan_type,
            formData.wan_settings
        ),
        wan6_settings: deleteUnnecessarySettings(
            formData.wan6_settings.wan6_type,
            formData.wan6_settings
        ),
        mac_settings: formData.mac_settings,
    };

    if (
        formData.wan6_settings.wan6_type === "6in4" &&
        !formData.wan6_settings.wan6_6in4.dynamic_ipv4.enabled
    ) {
        formData.wan6_settings.wan6_6in4.dynamic_ipv4 = { enabled: false };
    }

    if (!formData.mac_settings.custom_mac_enabled)
        delete dataToSubmit.mac_settings.custom_mac;

    return dataToSubmit;
}

function deleteUnnecessarySettings(type, settings) {
    return Object.keys(settings)
        .filter((setting) => setting.endsWith(type) || setting.endsWith("type"))
        .reduce(
            (accumulator, currentValue) => ({
                ...accumulator,
                [currentValue]: settings[currentValue],
            }),
            {}
        );
}

function validator(formData) {
    const errors = {
        wan_settings: validateWANForm(formData.wan_settings),
        wan6_settings: validateWAN6Form(formData.wan6_settings),
        mac_settings: validateMACForm(formData.mac_settings),
    };
    if (errors.wan_settings || errors.wan6_settings || errors.mac_settings)
        return errors;
    return null;
}
