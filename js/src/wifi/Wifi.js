/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react'

import withSettingsForm from "../settingsHelpers/withSettingsForm";
import WifiForm from './WifiForm';

const HTMODES = {
    NOHT: _('Disabled'),
    HT20: _('802.11n - 20 MHz wide channel'),
    HT40: _('802.11n - 40 MHz wide channel'),
    VHT20: _('802.11ac - 20 MHz wide channel'),
    VHT40: _('802.11ac - 40 MHz wide channel'),
    VHT80: _("802.11ac - 80 MHz wide channel"),
};

const HWMODES = {
    '11g': '2.4',
    '11a': '5'
};

class WifiBase extends React.Component {
    getChannelChoices = deviceId => {
        const device = this.props.formData.devices[deviceId];
        let channelChoices = {};

        device.available_bands.forEach((availableBand) => {
            if (availableBand.hwmode !== device.hwmode) return;

            availableBand.available_channels.forEach((availableChannel) => {
                channelChoices[availableChannel.number.toString()] = `
                        ${availableChannel.number}
                        (${availableChannel.frequency} MHz ${availableChannel.radar ? ' ,DFS' : ''})
                    `;
            })
        });

        channelChoices['0'] = _('auto');
        return channelChoices
    };

    getHtmodeChoices = deviceId => {
        const device = this.props.formData.devices[deviceId];
        let htmodeChoices = {};

        device.available_bands.forEach((availableBand) => {
            if (availableBand.hwmode !== device.hwmode)
                return;

            availableBand.available_htmodes.forEach((availableHtmod) => {
                htmodeChoices[availableHtmod] = HTMODES[availableHtmod]
            })
        });
        return htmodeChoices
    };

    getHwmodeChoices = deviceId => {
        const device = this.props.formData.devices[deviceId];

        return device.available_bands.map((availableBand) => {
            return {
                label: HWMODES[availableBand.hwmode],
                value: availableBand.hwmode,
            }
        });
    };

    render() {
        return this.props.formData.devices.map(device =>
            <WifiForm
                key={device.id}

                {...device}
                errors={this.props.formErrors ? this.props.formErrors[device.id] : {}}

                channelChoices={this.getChannelChoices(device.id)}
                htmodeChoices={this.getHtmodeChoices(device.id)}
                hwmodeChoices={this.getHwmodeChoices(device.id)}

                changeFormData={this.props.changeFormData}

                disabled={this.props.formIsDisabled}
            />
        );
    }
}

const validator = formData => {
    const errors = formData.devices.map(
        (device) => {
            if (!device.enabled) return {};

            let errors = {};
            if (device.SSID.length > 32)
                errors.SSID = _("SSID can't be longer than 32 symbols");
            if (device.SSID.length === 0)
                errors.SSID = _("SSID can\'t be empty");

            if (device.password.length < 8)
                errors.password = _('Password must contain at least 8 symbols');

            if (!device.guest_wifi.enabled) return errors;
            if (device.guest_wifi.password.length < 8)
                errors.guestWifiPassword = _('Password must contain at least 8 symbols');

            return errors;
        });
    return JSON.stringify(errors) === '[{},{}]' ? null : errors
};

function prepDataToSubmit(formData) {
    formData.devices.forEach((device, idx) => {
        delete device['available_bands'];

        formData.devices[idx].channel = parseInt(device.channel);

        if (!device.enabled) {
            formData.devices[idx] = {id: device.id, enabled: false};
            return;
        }

        if (!device.guest_wifi.enabled)
            formData.devices[idx].guest_wifi = {enabled: false};
    });
    return formData;
}

const Wifi = withSettingsForm('wifi', null, prepDataToSubmit, validator)(WifiBase);

export default Wifi;
