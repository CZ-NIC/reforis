/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import PropTypes from 'prop-types';

import ForisForm from 'form/ForisForm';
import API_URLs from 'common/API';
import {validateIPv4Address} from 'common/validations';
import {ForisURLs} from 'common/constants';

import GuestNetworkForm from './GuestNetworkForm';
import GuestNetworkDHCPClientsList from './GuestNetworkDHCPClientsList';

GuestNetwork.propTypes = {
    ws: PropTypes.object.isRequired
};

export default function GuestNetwork({ws}) {
    return <>
        <h1>{_('Guest network')}</h1>
        <p dangerouslySetInnerHTML={{
            __html: _(`
Guest network is used for <a href="${ForisURLs.wifi}">guest Wi-Fi</a>.
It is separated from your ordinary LAN. Devices connected to this network are allowed to access the
internet, but are not allowed to access the configuration interface of the this device nor the devices
in LAN.
        `)
        }}
        />
        <ForisForm
            ws={ws}
            forisConfig={{
                endpoint: API_URLs.guestNetwork,
                wsModule: 'guest'
            }}
            prepData={prepData}
            prepDataToSubmit={prepDataToSubmit}
            validator={validator}
        >
            <GuestNetworkForm/>
            <GuestNetworkDHCPClientsList/>
        </ForisForm>
        <div id="dhcp_clients_container"/>
    </>
}

function prepData(formData) {
    delete formData.interface_count;
    delete formData.interface_up_count;
    return formData
}

export function prepDataToSubmit(formData) {
    if (!formData.enabled)
        return {enabled: false};

    if (!formData.dhcp.enabled)
        formData.dhcp = {enabled: false};
    else
        delete formData.dhcp.clients;

    if (!formData.qos.enabled)
        formData.qos = {enabled: false};

    return formData
}

export function validator(formData) {
    const errors = {
        ip: validateIPv4Address(formData.ip),
        netmask: validateIPv4Address(formData.netmask),
    };
    return errors.ip || errors.netmask ? errors : undefined;
}
