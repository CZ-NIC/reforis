/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react'

import WifiForm from './WifiForm';
import {ForisSettingWrapper, STATES} from "../settingsHelpers/Wrappers";
import SettingsSubmitButton from "../settingsHelpers/SettingsSubmitButton";

const HTMODES = {
    NOHT: _('Disabled'),
    HT20: _('802.11n - 20 MHz wide channel'),
    HT40: _('802.11n - 40 MHz wide channel'),
    VHT20: _('802.11ac - 20 MHz wide channel'),
    VHT40: _('802.11ac - 40 MHz wide channel'),
    VHT80: _("802.11ac - 80 MHz wide channel"),
};

const HWMODES = {
    '11g': _('2.4'),
    '11a': _('5')
};

class WifiBase extends React.Component {
    componentDidMount() {
        this.validate();
    }

    getChannelChoices = (deviceId) => {
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

    getHtmodeChoices = (deviceId) => {
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

    getHwmodeChoices = (deviceId) => {
        const device = this.props.formData.devices[deviceId];

        return device.available_bands.map((availableBand) => {
            return {
                label: HWMODES[availableBand.hwmode],
                value: availableBand.hwmode,
            }
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.setFormState(STATES.UPDATE);
        const data = this.getPreparedDataToSubmit();
        this.props.postSettings(data);
    };

    getPreparedDataToSubmit() {
        let data = {'devices': []};

        this.props.formData.devices.forEach((device, idx) => {
            data.devices[idx] = {...device};
        });

        data.devices.forEach((device, idx) => {
            delete device['available_bands'];
            delete device['errors'];

            if (!device.enabled) {
                data.devices[idx] = {id: device.id, enabled: false};
                return;
            }

            if (!device.guest_wifi.enabled)
                data.devices[idx].guest_wifi = {enabled: false};
        });

        return data;
    }

    validate() {
        if (!this.props.formData) return;

        this.props.formData.devices.forEach((device) => {
            this.updateDevice(device.id, 'errors', WifiBase.validateDevice(device));
        });
    }

    static validateDevice(device) {
        if (!device.enabled) return {};

        let errors = {};
        if (device.SSID.length > 32)
            errors.SSID = _('SSID can\'t be longer than 32 symbols');
        if (device.password.length < 8)
            errors.password = _('Password must contain at least 8 symbols');

        if (!device.guest_wifi.enabled) return errors;
        if (device.guest_wifi.password.length < 8)
            errors.guestWifiPassword = _('Password must contain at least 8 symbols');

        return errors;
    }

    isValid() {
        if (!this.props.formData) return;

        let valid = true;
        this.props.formData.devices.forEach((device) => {
            if (typeof device.errors !== 'undefined' && Object.keys(device.errors).length !== 0)
                valid = false;
        });
        return valid
    }


    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                {this.getForms()}
                <SettingsSubmitButton
                    disable={!this.isValid()}
                    state={this.props.formState}
                    remindsToNWRestart={this.props.remindsToNWRestart}
                />
            </form>
        );
    }

    getForms() {
        if (!this.props.formData) return;

        return this.props.formData.devices.map((device) =>
            <div key={device.id}>
                <WifiForm
                    {...device}

                    getChannelChoices={this.getChannelChoices}
                    getHtmodeChoices={this.getHtmodeChoices}
                    getHwmodeChoices={this.getHwmodeChoices}

                    changeFormData={this.props.changeFormData}

                    disabled={this.props.formState !== STATES.READY}
                />
            </div>
        );
    }
}

const Wifi = ForisSettingWrapper(WifiBase, 'wifi');
export default Wifi;
