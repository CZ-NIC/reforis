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
import propTypes from 'prop-types';

WifiGuestForm.propTypes = {
    formData: propTypes.shape({
        id: propTypes.number.isRequired,
        SSID: propTypes.string.isRequired,
        password: propTypes.string.isRequired,
    }),
    formErrors: propTypes.shape({
        SSID: propTypes.string,
        password: propTypes.string,
    }),
    setFormValue: propTypes.func.isRequired,
};

export function WifiGuestForm({formData, formErrors, setFormValue, ...props}) {
    return <>
        <CheckBox
            label={_('Enable Guest Wifi')}
            checked={formData.enabled}
            helpText={HELP_TEXTS.guest_wifi_enabled}

            onChange={setFormValue(
                value => ({devices: {[formData.id]: {guest_wifi: {enabled: {$set: value}}}}})
            )}

            {...props}
        />
        {formData.enabled ?
            <>
                <TextInput
                    label='SSID'
                    value={formData.SSID}
                    error={formErrors.SSID}

                    onChange={setFormValue(
                        value => ({devices: {[formData.id]: {guest_wifi: {SSID: {$set: value}}}}})
                    )}

                    {...props}
                />

                <PasswordInput
                    label={_('Password')}
                    value={formData.password}
                    helpText={HELP_TEXTS.password}
                    error={formErrors.password}
                    required

                    onChange={setFormValue(
                        value => ({devices: {[formData.id]: {guest_wifi: {password: {$set: value}}}}})
                    )}

                    {...props}
                />
            </>
            : null}
    </>
}