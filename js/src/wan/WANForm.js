/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';

import Select from '../bootstrap/Select';
import TextInput from '../bootstrap/TextInput';
import DHCPForm, {validateDHCPForm} from '../forisForm/networkForms/DHCPForm';
import StaticForm, {validateStaticForm} from '../forisForm/networkForms/StaticForm';

const WAN_TYPES = {
    dhcp: 'dhcp',
    static: 'static',
    pppoe: 'pppoe',
};
const WAN_TYPE_CHOICES = {
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
            choices={WAN_TYPE_CHOICES}
            disabled={props.disabled}
            onChange={props.setFormValue(
                value => ({wan_settings: {wan_type: {$set: value}}})
            )}
        />
        {wanType === WAN_TYPES.dhcp ?
            <DHCPForm
                formData={formData.wan_dhcp}
                formErrors={formErrors.wan_dhcp}
                disabled={props.disabled}
                updateRule={value => ({wan_settings: {wan_dhcp: value}})}

                setFormValue={props.setFormValue}
            />
            : wanType === WAN_TYPES.static ?
                <StaticForm
                    formData={formData.wan_static}
                    formErrors={formErrors.wan_static}
                    disabled={props.disabled}
                    updateRule={value => ({wan_settings: {wan_static: value}})}

                    setFormValue={props.setFormValue}
                />
                : wanType === WAN_TYPES.pppoe ?
                    <PPPoEForm
                        formData={formData.wan_pppoe}
                        formErrors={formErrors.wan_pppoe}
                        disabled={props.disabled}

                        setFormValue={props.setFormValue}
                    />
                    : null}
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
        case WAN_TYPES.dhcp:
            errors.wan_dhcp = validateDHCPForm(formData.wan_dhcp);
            break;
        case WAN_TYPES.static:
            errors.wan_static = validateStaticForm(formData.wan_static);
            break;
        case WAN_TYPES.pppoe:
            errors.wan_pppoe = validatePPPoEForm(formData.wan_pppoe);
            break;
    }
    return errors[`wan_${formData.wan_type}`] ? errors : null;
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
