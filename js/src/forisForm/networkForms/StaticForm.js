/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';

import TextInput from '../../bootstrap/TextInput';
import {validateIPv4Address} from '../validation';

const HELP_TEXTS = {
    dns: _('DNS server address is not required as the built-in DNS resolver is capable of working without it.'),
};

export default function StaticForm(props) {
    const formErrors = (props.formErrors || {});
    return <>
        <TextInput
            label={_('IP address')}
            value={props.formData.ip || ''}
            disabled={props.disabled}
            error={formErrors.ip || null}
            required

            onChange={props.setFormValue(
                value => props.updateRule({ip: {$set: value}})
            )}
        />
        <TextInput
            label={_('Network mask')}
            value={props.formData.netmask || ''}
            disabled={props.disabled}
            error={formErrors.netmask || null}
            required

            onChange={props.setFormValue(
                value => props.updateRule({netmask: {$set: value}})
            )}
        />
        <TextInput
            label={_('Gateway')}
            value={props.formData.gateway || ''}
            disabled={props.disabled}
            error={formErrors.gateway || null}
            required

            onChange={props.setFormValue(
                value => props.updateRule({gateway: {$set: value}})
            )}
        />
        <TextInput
            label={_('DNS server 1')}
            value={props.formData.dns1 || ''}
            disabled={props.disabled}
            error={formErrors.dns1 || null}
            helpText={HELP_TEXTS.dns}

            onChange={props.setFormValue(
                value => props.updateRule({dns1: {$set: value}})
            )}
        />
        <TextInput
            label={_('DNS server 2')}
            value={props.formData.dns2 || ''}
            disabled={props.disabled}
            error={formErrors.dns2 || null}
            helpText={HELP_TEXTS.dns}

            onChange={props.setFormValue(
                value => props.updateRule({dns2: {$set: value}})
            )}
        />
    </>
}

export function validateStaticForm(formData) {
    let errors = {};
    ['ip', 'netmask', 'gateway', 'dns1', 'dns2'].forEach(
        field => {
            let error = validateIPv4Address(formData[field]);
            if (error)
                errors[field] = error;
        }
    );
    ['ip', 'netmask', 'gateway'].forEach(
        field => {
            if (!formData[field] || formData[field] === '')
                errors[field] = _('This field is required.');
        }
    );

    return JSON.stringify(errors) !== '{}' ? errors : null;
}
