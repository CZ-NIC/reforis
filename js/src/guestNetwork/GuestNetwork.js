/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import propTypes from 'prop-types';

import ForisForm from '../formContainer/ForisForm';
import GuestNetworkForm from './GuestNetworkForm';
import {APIEndpoints} from '../common/API';
import {validateIPv4Address} from '../common/validations';

GuestNetwork.propTypes = {
    ws: propTypes.object.isRequired
};

export default function GuestNetwork({ws}) {
    return <ForisForm
        ws={ws}
        forisConfig={{
            endpoint: APIEndpoints.guestNetwork,
            wsModule: 'guest'
        }}
        prepData={prepData}
        prepDataToSubmit={prepDataToSubmit}
        validator={validator}
    >
        <GuestNetworkForm/>
    </ForisForm>
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
