/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';

import Select from '../bootstrap/Select';
import TextInput from '../bootstrap/TextInput';
import {validateDomain, validateIPv4Address} from '../forisForm/validation';

const HELP_TEXTS = {
    dns: _('DNS server address is not required as the built-in DNS resolver is capable of working without it.')
};

const WAN_CHOICES = {
    dhcp: _('DHCP (automatic configuration)'),
    static: _('Static IP address (manual configuration)'),
    pppoe: _('PPPoE (for DSL bridges, Modem Turris, etc.)'),
};


export default function WANForm(props) {
    const formData = props.formData.wan_settings;
    const formErrors = (props.formErrors || {}).wan_settings || {};
    const wanType = props.formData.wan_settings.wan_type;
    return <>
        <h3>{_('WAN IPv4')}</h3>
        <Select
            label={_('IPv4 protocol')}
            value={wanType}
            choices={WAN_CHOICES}
            disabled={props.disabled}
            onChange={props.setFormValue(
                value => ({wan_settings: {wan_type: {$set: value}}})
            )}
        />
        {
            wanType === 'dhcp' ?
                <DHCPForm
                    formData={formData.wan_dhcp}
                    formErrors={formErrors.wan_dhcp}
                    disabled={props.disabled}

                    setFormValue={props.setFormValue}
                />
                : wanType === 'static' ?
                <StaticForm
                    formData={formData.wan_static}
                    formErrors={formErrors.wan_static}
                    disabled={props.disabled}

                    setFormValue={props.setFormValue}
                />
                : wanType === 'pppoe' ?
                    <PPPoEForm
                        formData={formData.wan_pppoe}
                        formErrors={formErrors.wan_pppoe}
                        disabled={props.disabled}

                        setFormValue={props.setFormValue}
                    />
                    : null
        }
    </>

}

function DHCPForm(props) {
    return <TextInput
        label={_('DHCP hostname')}
        value={props.formData.hostname || ''}
        disabled={props.disabled}
        error={(props.formErrors || {}).hostname || null}

        onChange={props.setFormValue(
            value => ({wan_settings: {wan_dhcp: {hostname: {$set: value}}}})
        )}
    />
}

function StaticForm(props) {
    const formErrors = (props.formErrors || {});
    return <>
        <TextInput
            label={_('IP address')}
            value={props.formData.ip || ''}
            disabled={props.disabled}
            error={formErrors.ip || null}
            required

            onChange={props.setFormValue(
                value => ({wan_settings: {wan_static: {ip: {$set: value}}}})
            )}
        />
        <TextInput
            label={_('Network mask')}
            value={props.formData.netmask || ''}
            disabled={props.disabled}
            error={formErrors.netmask || null}
            required

            onChange={props.setFormValue(
                value => ({wan_settings: {wan_static: {netmask: {$set: value}}}})
            )}
        />
        <TextInput
            label={_('Gateway')}
            value={props.formData.gateway || ''}
            disabled={props.disabled}
            error={formErrors.gateway || null}
            required

            onChange={props.setFormValue(
                value => ({wan_settings: {wan_static: {gateway: {$set: value}}}})
            )}
        />
        <TextInput
            label={_('DNS server 1')}
            value={props.formData.dns1 || ''}
            disabled={props.disabled}
            error={formErrors.dns1 || null}
            helpText={HELP_TEXTS.dns}

            onChange={props.setFormValue(
                value => ({wan_settings: {wan_static: {dns1: {$set: value}}}})
            )}
        />
        <TextInput
            label={_('DNS server 2')}
            value={props.formData.dns2 || ''}
            disabled={props.disabled}
            error={formErrors.dns2 || null}
            helpText={HELP_TEXTS.dns}

            onChange={props.setFormValue(
                value => ({wan_settings: {wan_static: {dns2: {$set: value}}}})
            )}
        />
    </>
}

function PPPoEForm(props) {
    return <>
        <TextInput
            label={_('PAP/CHAP username')}
            value={props.formData.username || ''}
            disabled={props.disabled}
            error={(props.formErrors || {}).username || null}
            required

            onChange={props.setFormValue(
                value => ({wan_settings: {wan_pppoe: {username: {$set: value}}}})
            )}
        />
        <TextInput
            label={_('PAP/CHAP password')}
            value={props.formData.password || ''}
            disabled={props.disabled}
            error={(props.formErrors || {}).password || null}
            required

            onChange={props.setFormValue(
                value => ({wan_settings: {wan_pppoe: {password: {$set: value}}}})
            )}
        />
    </>

}


export function validateWANForm(formData) {
    let errors = {};
    switch (formData.wan_type) {
        case 'dhcp':
            errors.wan_dhcp = validateDHCPForm(formData.wan_dhcp);
            break;
        case 'static':
            errors.wan_static = validateStaticForm(formData.wan_static);
            break;
        case 'pppoe':
            errors.wan_pppoe = validatePPPoEForm(formData.wan_pppoe);
            break;
    }
    return errors['wan_' + formData.wan_type] ? errors : null;
}

function validateDHCPForm(wan_dhcp) {
    const error = {hostname: validateDomain(wan_dhcp.hostname)};
    return error.hostname ? error : null;
}


function validateStaticForm(wan_static) {
    let errors = {};
    ['ip', 'netmask', 'gateway', 'dns1', 'dns2'].forEach(
        field => {
            let error = validateIPv4Address(wan_static[field]);
            if (error)
                errors[field] = error;
        }
    );
    ['ip', 'netmask', 'gateway'].forEach(
        field => {
            if (!wan_static[field] || wan_static[field] === '')
                errors[field] = _('This field is required.');
        }
    );

    return JSON.stringify(errors) !== '{}' ? errors : null;
}

function validatePPPoEForm(wan_pppoe) {
    let errors = {};
    ['username', 'password'].forEach(
        field => {
            if (!wan_pppoe[field] || wan_pppoe[field] === '')
                errors[field] = _('This field is required.');
        }
    );
    return JSON.stringify(errors) !== '{}' ? errors : null;
}

