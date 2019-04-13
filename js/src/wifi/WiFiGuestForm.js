/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';

import CheckBox from '../bootstrap/Checkbox';
import TextInput from '../bootstrap/TextInput';
import PasswordInput from '../bootstrap/PasswordInput';

import {HELP_TEXTS} from './WiFiForm';

export function WifiGuestForm(props) {
    return <>
        <CheckBox
            label='Enable Guest Wifi'
            checked={props.formData.enabled}
            disabled={props.disabled}
            helpText={HELP_TEXTS.guest_wifi_enabled}

            onChange={props.setFormValue(
                value => ({devices: {[props.formData.id]: {guest_wifi: {enabled: {$set: value}}}}})
            )}
        />
        {props.formData.enabled ?
            <>
                <TextInput
                    label='SSID'
                    value={props.formData.SSID}
                    disabled={props.disabled}

                    onChange={props.setFormValue(
                        value => ({devices: {[props.formData.id]: {guest_wifi: {SSID: {$set: value}}}}})
                    )}
                />

                <PasswordInput
                    label='Password'
                    value={props.formData.password}
                    helpText={HELP_TEXTS.password}
                    disabled={props.disabled}
                    error={props.errors.password}
                    required

                    onChange={props.setFormValue(
                        value => ({devices: {[props.formData.id]: {guest_wifi: {password: {$set: value}}}}})
                    )}
                />
            </>
            : null}
    </>
}