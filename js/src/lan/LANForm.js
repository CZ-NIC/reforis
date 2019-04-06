/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';

import Select from '../bootstrap/Select';
import LANManagedForm from './LANManagedForm';
import LANUnmanagedForm from './LANUnmanagedForm';

const HELP_TEXTS = {
    mode: _('Router mode means that this devices manages the LAN (acts as a router, can assing IP addresses, ...). ' +
        'Computer mode means that this device acts as a client in this network. It acts in a similar way as WAN, but ' +
        'it has opened ports for configuration interface and other services.'),
};

export const LAN_MODES = {
    managed: 'managed',
    unmanaged: 'unmanaged',
};
const LAN_MOD_CHOICES = {
    managed: _('Router'),
    unmanaged: _('Computer'),
};

export default function LANForm(props) {
    const formErrors = props.formErrors || {};
    const lanMode = props.formData.mode;
    return <>
        <h3>{_('LAN Settings')}</h3>
        <Select
            label={_('LAN mode')}
            value={props.formData.mode}
            choices={LAN_MOD_CHOICES}
            helpText={HELP_TEXTS.mode}
            disabled={props.disabled}
            onChange={props.setFormValue(
                value => ({mode: {$set: value}})
            )}
        />
        {lanMode === LAN_MODES.managed ?
            <LANManagedForm
                formData={props.formData.mode_managed}
                formErrors={formErrors.mode_managed}
                disabled={props.disabled}
                updateRule={value => ({mode_managed: {dhcp: value}})}

                setFormValue={props.setFormValue}
            />
            : lanMode === LAN_MODES.unmanaged ?
                <LANUnmanagedForm
                    formData={props.formData.mode_unmanaged}
                    formErrors={formErrors.mode_unmanaged}
                    disabled={props.disabled}
                    updateRule={value => ({mode_unmanaged: {static: value}})}

                    setFormValue={props.setFormValue}
                />
                : null}
    </>
}
