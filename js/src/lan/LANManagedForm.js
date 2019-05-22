/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import propTypes from 'prop-types';

import TextInput from '../common/bootstrap/TextInput';
import CheckBox from '../common/bootstrap/Checkbox';
import {validateIPv4Address} from '../common/validations';
import DHCPServerForm, {HELP_TEXT as DHCP_HELP_TEXT} from '../common/networkForms/DHCPServerForm';

const HELP_TEXTS = {
    router_ip: _("Router's IP address in the inner network."),
    dhcp: DHCP_HELP_TEXT,
};

LANManagedForm.propTypes = {
    formData: propTypes.shape({
        router_ip: propTypes.string.isRequired,
        netmask: propTypes.string,
        dhcp: propTypes.object,
    }).isRequired,
    formErrors: propTypes.shape({
        mode_managed: propTypes.object,
        mode_unmanaged: propTypes.object,
    }),
    setFormValue: propTypes.func.isRequired,
};

LANManagedForm.defaultProps = {
    formData: {},
};

export default function LANManagedForm({formData, formErrors, setFormValue, ...props}) {
    const errors = (formErrors || {});
    return <>
        <TextInput
            label={_('Router IP address')}
            value={formData.router_ip || ''}
            error={errors.router_ip || null}
            helpText={HELP_TEXTS.router_ip}
            required

            onChange={setFormValue(
                value => ({mode_managed: {router_ip: {$set: value}}})
            )}

            {...props}
        />
        <TextInput
            label={_('Network mask')}
            value={formData.netmask || ''}
            error={errors.netmask || null}
            required

            onChange={setFormValue(
                value => ({mode_managed: {netmask: {$set: value}}})
            )}

            {...props}
        />
        <CheckBox
            label={_('Enable DHCP')}
            checked={formData.dhcp.enabled}
            helpText={HELP_TEXTS.dhcp}

            onChange={setFormValue(
                value => ({mode_managed: {dhcp: {enabled: {$set: value}}}})
            )}

            {...props}
        />
        {formData.dhcp.enabled ?
            <DHCPServerForm
                formData={formData.dhcp}

                updateRule={value => ({mode_managed: {dhcp: value}})}
                setFormValue={setFormValue}

                {...props}
            />
            : null}
    </>
}


export function validateManaged(formData) {
    const errors = {
        router_ip: validateIPv4Address(formData.router_ip) || undefined,
        netmask: validateIPv4Address(formData.netmask) || undefined,
    };
    return JSON.stringify(errors) !== '{}' ? errors : null;
}
