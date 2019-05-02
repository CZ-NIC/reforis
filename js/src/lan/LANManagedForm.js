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
import NumberInput from '../common/bootstrap/NumberInput';
import {validateIPv4Address} from '../common/validations';

const HELP_TEXTS = {
    router_ip: _("Router's IP address in the inner network."),
    dhcp: _('Enable this option to automatically assign IP addresses to the devices connected to the router.')
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
            <LANManagedDHCPForm
                formData={formData.dhcp}
                formErrors={errors.dhcp}
                setFormValue={setFormValue}

                {...props}
            />
            : null}
    </>
}

LANManagedDHCPForm.propTypes = {
    formData: propTypes.shape({
        start: propTypes.number,
        limit: propTypes.number,
        lease_time: propTypes.number,
    }).isRequired,
    formErrors: propTypes.shape({
        start: propTypes.number,
        limit: propTypes.number,
        lease_time: propTypes.number,
    }),
    setFormValue: propTypes.func.isRequired,
};

LANManagedDHCPForm.defaultProps = {
    formData: {},
    formErrors: {},
};

function LANManagedDHCPForm({formData, formErrors, setFormValue, ...props}) {
    return <>
        <NumberInput
            label={_('DHCP start')}
            value={formData.start}
            error={formErrors.start}
            min='1'
            required

            onChange={setFormValue(
                value => ({mode_managed: {dhcp: {start: {$set: value}}}})
            )}

            {...props}
        />
        <NumberInput
            label={_('DHCP max leases')}
            value={formData.limit}
            error={formErrors.limit}
            min='1'
            required

            onChange={setFormValue(
                value => ({mode_managed: {dhcp: {limit: {$set: value}}}})
            )}

            {...props}
        />
        <NumberInput
            label={_('Lease time (hours)')}
            value={formData.lease_time}
            error={formErrors.lease_time}
            min='120'
            required

            onChange={setFormValue(
                value => ({mode_managed: {dhcp: {lease_time: {$set: value}}}})
            )}

            {...props}
        />
    </>
}

export function validateManaged(formData) {
    const errors = {
        router_ip: validateIPv4Address(formData.router_ip) || undefined,
        netmask: validateIPv4Address(formData.netmask) || undefined,
        // TODO: DHCP
    };
    return JSON.stringify(errors) !== '{}' ? errors : null;
}
