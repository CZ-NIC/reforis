/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';

import {validateDomain} from '../forisForm/validation';
import ForisForm from '../forisForm/ForisForm';

import DNSForm from './DNSForm';

export default function DNS({ws}) {
    return <ForisForm
        ws={ws}
        module='dns'
        validator={validator}
        prepData={formData => formData}
        prepDataToSubmit={prepDataToSubmit}
    >
        <DNSForm/>
    </ForisForm>
}

function validator(formData) {
    let error = {};
    if (formData.dns_from_dhcp_enabled)
        error.dns_from_dhcp_domain = validateDomain(formData.dns_from_dhcp_domain);
    return error.dns_from_dhcp_domain ? error : undefined;
}

function prepDataToSubmit(formData) {
    delete formData.available_forwarders;
    if (!formData.forwarding_enabled)
        delete formData.forwarder;
    return formData
}
