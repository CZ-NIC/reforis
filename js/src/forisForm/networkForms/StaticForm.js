/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import propTypes from 'prop-types';

import TextInput from '../../bootstrap/TextInput';
import {validateIPv4Address} from '../validation';

const HELP_TEXTS = {
    dns: _('DNS server address is not required as the built-in DNS resolver is capable of working without it.'),
};

const FIELDS_PROP_TYPES = {
    ip: propTypes.string,
    netmask: propTypes.string,
    gateway: propTypes.string,
    dns1: propTypes.string,
    dns2: propTypes.string,
};

StaticForm.propTypes = {
    formData: propTypes.shape(FIELDS_PROP_TYPES).isRequired,
    formErrors: propTypes.shape(FIELDS_PROP_TYPES),
    setFormValue: propTypes.func.isRequired,
    updateRule: propTypes.func.isRequired,
};

export default function StaticForm({formData, formErrors, updateRule, setFormValue, ...props}) {
    return <>
        <TextInput
            label={_('IP address')}
            value={formData.ip || ''}
            error={formErrors.ip || null}
            required

            onChange={setFormValue(
                value => updateRule({ip: {$set: value}})
            )}

            {...props}
        />
        <TextInput
            label={_('Network mask')}
            value={formData.netmask || ''}
            error={formErrors.netmask || null}
            required

            onChange={setFormValue(
                value => updateRule({netmask: {$set: value}})
            )}

            {...props}
        />
        <TextInput
            label={_('Gateway')}
            value={formData.gateway || ''}
            error={formErrors.gateway || null}
            required

            onChange={setFormValue(
                value => updateRule({gateway: {$set: value}})
            )}

            {...props}
        />
        <TextInput
            label={_('DNS server 1')}
            value={formData.dns1 || ''}
            error={formErrors.dns1 || null}
            helpText={HELP_TEXTS.dns}

            onChange={setFormValue(
                value => updateRule({dns1: {$set: value}})
            )}

            {...props}
        />
        <TextInput
            label={_('DNS server 2')}
            value={formData.dns2 || ''}
            error={formErrors.dns2 || null}
            helpText={HELP_TEXTS.dns}

            onChange={setFormValue(
                value => updateRule({dns2: {$set: value}})
            )}

            {...props}
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
