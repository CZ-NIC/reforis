/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react'
import update from 'immutability-helper';

import WifiForm from './WifiForm';
import {Button} from '../bootstrap/Button';
import {ForisAPI} from "../api/api";

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

class Wifi extends React.Component {
    static states = {
        READY: 1,
        UPDATE: 2,
        NETWORK_RESTART: 3,
        LOAD: 4,
    };

    constructor(props) {
        super(props);
        this.state = {
            devices: [],
            state: null,
        }
    }

    componentDidMount() {
        this.loadSettings();
        window.forisWS
            .subscribe('wifi')
            .bind('wifi', 'update_settings',
                msg => {
                    this.setState({state: Wifi.states.UPDATE});
                }
            );
        window.forisWS.bind('maintain', 'network-restart',
            (msg) => {
                const remainsSec = msg.data.remains / 1000;
                if (remainsSec === 0) {
                    this.setState({state: Wifi.states.READY});
                    this.loadSettings();
                    return;
                }

                this.setState({
                        remindsToNWRestart: remainsSec,
                        state: Wifi.states.NETWORK_RESTART
                    }
                );
            }
        );
    }

    loadSettings() {
        this.setState({state: Wifi.states.LOAD});
        ForisAPI.wifi.get()
            .then(data => {
                this.setState(data, () => {
                    this.validate();
                });
                this.setState({state: Wifi.states.READY});
            });
    }

    handleWifiFormChange = (deviceId, target) => {
        let value = target.value;
        if (target.type === 'checkbox')
            value = target.checked;
        else if (target.name === 'channel')
            value = parseInt(target.value);

        // Delete postfix id from hwmode radios names because it's not needed here but in HTML it should have
        // different names.
        const name = target.name.startsWith('hwmode') ? 'hwmode' : target.name;

        this.updateDevice(deviceId, name, value);
    };

    handleGuestWifiFormChange = (deviceId, target) => {
        const newGuestWifiState = update(
            this.state.devices[deviceId].guest_wifi,
            {[target.name]: {$set: target.type === 'checkbox' ? target.checked : target.value}}
        );

        this.updateDevice(deviceId, 'guest_wifi', newGuestWifiState);
    };

    updateDevice(deviceId, target, value) {
        const device = this.state.devices[deviceId];
        let newDeviceState = update(
            device,
            {[target]: {$set: value}}
        );
        newDeviceState = update(
            newDeviceState,
            {errors: {$set: Wifi.validateDevice(newDeviceState)}}
        );

        this.setState(update(
            this.state,
            {devices: {$splice: [[deviceId, 1, newDeviceState]]}}
        ));
    }

    getChannelChoices = (deviceId) => {
        const device = this.state.devices[deviceId];
        let channelChoices = [];

        device.available_bands.forEach((availableBand) => {
            if (availableBand.hwmode !== device.hwmode) return;

            channelChoices = availableBand.available_channels.map((availableChannel) => {
                return {
                    label: `
                        ${availableChannel.number}
                        (${availableChannel.frequency} MHz ${availableChannel.radar ? ' ,DFS' : ''})
                    `,
                    value: availableChannel.number
                };
            })
        });

        channelChoices.unshift({label: _('auto'), value: 0});
        return channelChoices
    };

    getHtmodeChoices = (deviceId) => {
        const device = this.state.devices[deviceId];
        let htmodeChoices = [];

        device.available_bands.forEach((availableBand) => {
            if (availableBand.hwmode !== device.hwmode)
                return;

            htmodeChoices = availableBand.available_htmodes.map((availableHtmod) => {
                return {
                    label: HTMODES[availableHtmod],
                    value: availableHtmod,
                };
            })
        });
        return htmodeChoices
    };

    getHwmodeChoices = (deviceId) => {
        const device = this.state.devices[deviceId];

        return device.available_bands.map((availableBand) => {
            return {
                label: HWMODES[availableBand.hwmode],
                value: availableBand.hwmode,
            }
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({state: Wifi.states.UPDATE});
        const data = this.getPreparedDataToSubmit();
        ForisAPI.wifi.post(data)
            .then(result => console.log(result));
    };

    getPreparedDataToSubmit() {
        let data = {'devices': []};

        this.state.devices.forEach((device, idx) => {
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
        this.state.devices.forEach((device) => {
            this.updateDevice(device.id, 'errors', Wifi.validateDevice(device));
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
        let valid = true;
        this.state.devices.forEach((device) => {
            if (typeof device.errors !== 'undefined' && Object.keys(device.errors).length !== 0)
                valid = false;
        });
        return valid
    }


    render() {
        const devices_count = this.state.devices.length;
        return (
            <form onSubmit={this.handleSubmit}>
                <p>{_(
                    'If you want to use your router as a Wi-Fi access point, enable Wi-Fi here and fill in an SSID ' +
                    '(the name of the access point) and a corresponding password. You can then set up your  mobile ' +
                    'devices, using the QR code available within the form.'
                )}</p>

                {/* TODO: delete this plural test.*/}
                <p>
                    {babel.format(
                        ngettext('You have %d wifi module', 'You have %d wifi modules.', devices_count),
                        devices_count
                    )}
                </p>

                {this.getForms()}
                {this.getSubmitButton()}
            </form>
        );
    }

    getForms() {
        return this.state.devices.map((device) =>
            <div key={device.id}>
                <WifiForm
                    {...device}

                    getChannelChoices={this.getChannelChoices}
                    getHtmodeChoices={this.getHtmodeChoices}
                    getHwmodeChoices={this.getHwmodeChoices}

                    onWifiFormChange={this.handleWifiFormChange}
                    onGuestWifiFormChange={this.handleGuestWifiFormChange}

                    disabled={this.state.state !== Wifi.states.READY}
                />
            </div>
        );
    }

    getSubmitButton() {
        const disableSubmitButton = !this.isValid() || this.state.state !== Wifi.states.READY;
        const loadingSubmitButton = this.state.state !== Wifi.states.READY;
        let labelSubmitButton;
        switch (this.state.state) {
            case Wifi.states.UPDATE:
                labelSubmitButton = 'Updating';
                break;
            case Wifi.states.LOAD:
                labelSubmitButton = 'Load settings';
                break;
            case Wifi.states.NETWORK_RESTART:
                labelSubmitButton = 'Restarting after ' + this.state.remindsToNWRestart + ' sec.';
                break;
            default:
                labelSubmitButton = 'Save'
        }

        return <Button
            id='wifi-submit-button'
            className='btn-primary'
            loading={loadingSubmitButton}
            disabled={disableSubmitButton}
        >
            {labelSubmitButton}
        </Button>;
    }

}


export default Wifi;
