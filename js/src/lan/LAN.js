/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import API_URLs from "common/API";
import { ForisForm } from "foris";

import LANForm, { LAN_MODES } from "./LANForm";
import { validateManaged } from "./LANManagedForm";
import { validateUnmanaged } from "./LANUnmanagedForm";
import LAN_DHCP_ClientsList from "./LAN_DHCP_ClientsList";

LAN.propTypes = {
    ws: PropTypes.object.isRequired,
};

export default function LAN({ ws }) {
    return (
        <>
            <h1>LAN</h1>
            <p
                dangerouslySetInnerHTML={{
                    __html: _(`
This section contains settings for the local network (LAN). The provided defaults are suitable for most
networks.
<br/>
<b>Note:</b> If you change the router IP address, all computers in LAN, probably including the one you are
using now, will need to obtain a <b>new IP address</b> which does not happen <b>immediately</b>. It is
recommended to disconnect and reconnect all LAN cables after submitting your changes to force the update.
The next page will not load until you obtain a new IP from DHCP (if DHCP enabled) and you might need to
<b>refresh the page</b> in your browser.
            `),
                }}
            />
            <ForisForm
                ws={ws}
                forisConfig={{
                    endpoint: API_URLs.lan,
                    wsModule: "lan",
                }}
                prepData={prepData}
                prepDataToSubmit={prepDataToSubmit}
                validator={validator}
            >
                <LANForm />
                {/* eslint-disable-next-line react/jsx-pascal-case */}
                <LAN_DHCP_ClientsList />
            </ForisForm>
            <div id="dhcp-clients-container" />
        </>
    );
}

function prepData(formData) {
    // Be sure to convert start address only once.
    // eslint-disable-next-line no-restricted-globals
    return formData;
}

function prepDataToSubmit(formData) {
    delete formData.interface_count;
    delete formData.interface_up_count;

    if (formData.mode === LAN_MODES.managed) {
        delete formData.mode_unmanaged;
        delete formData.mode_managed.dhcp.clients;
        if (!formData.mode_managed.dhcp.enabled)
            formData.mode_managed.dhcp = { enabled: false };
    } else if (formData.mode === LAN_MODES.unmanaged) {
        delete formData.mode_managed;
        const lanType = formData.mode_unmanaged.lan_type;
        formData.mode_unmanaged = {
            lan_type: lanType,
            [`lan_${lanType}`]: formData.mode_unmanaged[`lan_${lanType}`],
        };
    }

    return formData;
}

function validator(formData) {
    const errors = {};
    if (formData.mode === LAN_MODES.managed) {
        errors.mode_managed = validateManaged(formData.mode_managed);
    } else if (formData.mode === LAN_MODES.unmanaged) {
        errors.mode_unmanaged = validateUnmanaged(formData.mode_unmanaged);
    }
    return errors[`mode_${formData.mode}`] ? errors : null;
}
