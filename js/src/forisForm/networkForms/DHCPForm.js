/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';

import TextInput from '../../bootstrap/TextInput';
import {validateDomain} from '../validation';

const HELP_TEXTS = {
    dhcp_hostname: _('Hostname which will be provided to DHCP server.'),
};

export default function DHCPForm(props) {
    return <TextInput
        label={_('DHCP hostname')}
        value={props.formData.hostname || ''}
        disabled={props.disabled}
        error={(props.formErrors || {}).hostname || null}
        helpText={HELP_TEXTS.dhcp_hostname}
        onChange={props.setFormValue(
            value => props.updateRule({hostname: {$set: value}})
        )}
    />
}

export function validateDHCPForm(formData) {
    const error = {hostname: validateDomain(formData.hostname)};
    return error.hostname ? error : null;
}
