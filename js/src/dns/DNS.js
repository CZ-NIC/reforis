/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import propTypes from 'prop-types';

import {validateDomain} from '../common/validations';
import ForisForm from '../formContainer/ForisForm';

import API_URLs from '../common/API';
import DNSForm from './DNSForm';
import ConnectionTest from '../connectionTest/ConnectionTest';

DNS.propTypes = {
    ws: propTypes.object.isRequired
};

export default function DNS({ws, postCallback}) {
    return <>
        <ForisForm
            ws={ws}
            forisConfig={{
                endpoint: API_URLs.dns,
                wsModule: 'dns',
            }}
            postCallback={postCallback}
            validator={validator}
            prepDataToSubmit={prepDataToSubmit}
        >
            <DNSForm/>
        </ForisForm>

        <h1>{_('Connection test')}</h1>
        <p
            dangerouslySetInnerHTML={{
                __html: _(`
Here you can test your internet connection. This test is also useful when you need to check that your DNS resolving 
works as expected. Remember to click on the <b>Save button</b> if you changed your forwarder setting.
        `)
            }}
        />
        <ConnectionTest ws={ws} type='dns'/>
    </>
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
