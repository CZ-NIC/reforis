/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';

import Select from '../bootstrap/Select';
import DHCPForm, {validateDHCPForm} from '../forisForm/networkForms/DHCPForm';
import StaticForm, {validateStaticForm} from '../forisForm/networkForms/StaticForm';

const LAN_TYPES = {
    dhcp: 'dhcp',
    static: 'static',
    none: 'none',
};

const LAN_TYPE_CHOICES = {
    dhcp: _('DHCP (automatic configuration)'),
    static: _('Static IP address (manual configuration)'),
    none: _("Don't connect this device to LAN"),
};

export default function LANUnmanagedForm(props) {
    const formErrors = (props.formErrors || {});
    const lanType = props.formData.lan_type;
    return <>
        <Select
            label={_('IPv4 protocol')}
            value={lanType}
            choices={LAN_TYPE_CHOICES}
            disabled={props.disabled}
            onChange={props.setFormValue(
                value => ({mode_unmanaged: {lan_type: {$set: value}}})
            )}
        />
        {lanType === LAN_TYPES.dhcp ?
            <DHCPForm
                formData={props.formData.lan_dhcp}
                formErrors={formErrors.lan_dhcp}
                disabled={props.disabled}
                updateRule={value => ({mode_unmanaged: {lan_dhcp: value}})}

                setFormValue={props.setFormValue}
            />
            : lanType === LAN_TYPES.static ?
                <StaticForm
                    formData={props.formData.lan_static}
                    formErrors={formErrors.lan_static}
                    disabled={props.disabled}
                    updateRule={value => ({mode_unmanaged: {lan_static: value}})}

                    setFormValue={props.setFormValue}
                />
                : null}
    </>
}

export function validateUnmanaged(formData) {
    let errors = {};
    if (formData.lan_type === LAN_TYPES.dhcp)
        errors.lan_dhcp = validateDHCPForm(formData.lan_dhcp);
    else if (formData.lan_type === LAN_TYPES.static)
        errors.lan_static = validateStaticForm(formData.lan_static);

    return errors[`lan_${formData.lan_type}`] ? errors : null;
}
