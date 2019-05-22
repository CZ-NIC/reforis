/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import propTypes from 'prop-types';

import Select from '../common/bootstrap/Select';
import DHCPClientForm, {validateDHCPForm} from '../common/networkForms/DHCPClientForm';
import StaticForm, {validateStaticForm} from '../common/networkForms/StaticForm';

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

LANUnmanagedForm.propTypes = {
    formData: propTypes.shape({
        lan_dhcp: propTypes.object,
        lan_static: propTypes.object,
    }).isRequired,
    formErrors: propTypes.shape({
        lan_dhcp: propTypes.object,
        lan_static: propTypes.object,
    }),
    setFormValue: propTypes.func.isRequired,
};

LANUnmanagedForm.defaultProps = {
    formData: {},
    formErrors: {},
};

export default function LANUnmanagedForm({formData, formErrors, setFormValue, ...props}) {
    const lanType = formData.lan_type;
    return <>
        <Select
            label={_('IPv4 protocol')}
            value={lanType}
            choices={LAN_TYPE_CHOICES}

            onChange={setFormValue(
                value => ({mode_unmanaged: {lan_type: {$set: value}}})
            )}

            {...props}
        />
        {lanType === LAN_TYPES.dhcp ?
            <DHCPClientForm
                formData={formData.lan_dhcp}
                formErrors={formErrors.lan_dhcp}

                updateRule={value => ({mode_unmanaged: {lan_dhcp: value}})}
                setFormValue={setFormValue}

                {...props}
            />
            : lanType === LAN_TYPES.static ?
                <StaticForm
                    formData={formData.lan_static}
                    formErrors={formErrors.lan_static}

                    updateRule={value => ({mode_unmanaged: {lan_static: value}})}
                    setFormValue={setFormValue}

                    {...props}
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

    return errors[`lan_${formData.lan_type}`] ? errors : undefined;
}
