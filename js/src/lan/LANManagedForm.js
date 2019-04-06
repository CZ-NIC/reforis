/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';

import TextInput from '../bootstrap/TextInput';
import CheckBox from '../bootstrap/Checkbox';
import NumberInput from '../bootstrap/NumberInput';
import {validateIPv4Address} from '../forisForm/validation';

const HELP_TEXTS = {
    router_ip: _("Router's IP address in the inner network."),
    dhcp: _('Enable this option to automatically assign IP addresses to the devices connected to the router.')
};

export default function LANManagedForm(props) {
    const formErrors = (props.formErrors || {});
    return <>
        <TextInput
            label={_('Router IP address')}
            value={props.formData.router_ip || ''}
            error={formErrors.router_ip || null}
            helpText={HELP_TEXTS.router_ip}
            disabled={props.disabled}
            required

            onChange={props.setFormValue(
                value => ({mode_managed: {router_ip: {$set: value}}})
            )}
        />
        <TextInput
            label={_('Network mask')}
            value={props.formData.netmask || ''}
            disabled={props.disabled}
            error={formErrors.netmask || null}
            required

            onChange={props.setFormValue(
                value => ({mode_managed: {netmask: {$set: value}}})
            )}
        />
        <CheckBox
            label={_('Enable DHCP')}
            checked={props.formData.dhcp.enabled}
            helpText={HELP_TEXTS.dhcp}
            disabled={props.disabled}

            onChange={props.setFormValue(
                value => ({mode_managed: {dhcp: {enabled: {$set: value}}}})
            )}
        />
        {props.formData.dhcp.enabled ?
            <LANManagedDHCPForm
                formData={props.formData.dhcp}
                formErrors={formErrors.dhcp}
                disabled={props.disabled}

                setFormValue={props.setFormValue}
            />
            : null}
    </>
}


function LANManagedDHCPForm(props) {
    const formErrors = (props.formErrors || {});
    return <>
        <NumberInput
            label={_('DHCP start')}
            value={props.formData.start || ''}
            disabled={props.disabled}
            error={formErrors.start || null}
            min='1'
            required

            onChange={props.setFormValue(
                value => ({mode_managed: {dhcp: {start: {$set: value}}}})
            )}
        />
        <NumberInput
            label={_('DHCP max leases')}
            value={props.formData.limit || ''}
            disabled={props.disabled}
            error={formErrors.limit || null}
            min='1'
            required

            onChange={props.setFormValue(
                value => ({mode_managed: {dhcp: {limit: {$set: value}}}})
            )}
        />
        <NumberInput
            label={_('Lease time (hours)')}
            value={props.formData.lease_time || ''}
            disabled={props.disabled}
            error={formErrors.lease_time || null}
            min='120'
            required

            onChange={props.setFormValue(
                value => ({mode_managed: {dhcp: {lease_time: {$set: value}}}})
            )}
        />
    </>
}

export function validateManaged(formData) {
    const errors = {
        router_ip: validateIPv4Address(formData.router_ip) || undefined,
        netmask: validateIPv4Address(formData.netmask) || undefined,
        //    TODO:
        //    dhcp
    };
    return JSON.stringify(errors) !== '{}' ? errors : null;
}
