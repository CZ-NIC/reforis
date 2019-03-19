/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react'

import CheckBox from '../bootstrap/Checkbox';
import TextInput from '../bootstrap/TextInput';
import Password from '../bootstrap/Password';
import RadioSet from '../bootstrap/RadioSet';
import Select from '../bootstrap/Select';

const HELP_TEXTS = {
    password: _(`
        WPA2 pre-shared key, that is required to connect to the network.
    `),
    hidden: _('If set, network is not visible when scanning for available networks.'),
    hwmode: _(`
        The 2.4 GHz band is more widely supported by clients, but tends to have more interference. The 5 GHz band is a
        newer standard and may not be supported by all your devices. It usually has less interference, but the signal
        does not carry so well indoors.`
    ),
    htmode: _(`
        Change this to adjust 802.11n/ac mode of operation. 802.11n with 40 MHz wide channels can yield higher
        throughput but can cause more interference in the network. If you don't know what to choose, use the default
        option with 20 MHz wide channel.
    `),
    guest_wifi_enabled: _(`
        Enables Wi-Fi for guests, which is separated from LAN network. Devices connected to this network are allowed to
        access the internet, but aren't allowed to access other devices and the configuration interface of the router.
        Parameters of the guest network can be set in the Guest network tab.
        `),
};


class WifiForm extends React.PureComponent {
    onWifiFormChange = (event) => {
        this.props.onWifiFormChange(this.props.id, event.target);
    };

    onGuestWifiFormChange = (event) => {
        this.props.onGuestWifiFormChange(this.props.id, event.target);
    };

    getChannelChoices() {
        return this.props.getChannelChoices(this.props.id);
    };

    getHtmodeChoices() {
        return this.props.getHtmodeChoices(this.props.id);
    }

    getHwmodeChoices() {
        return this.props.getHwmodeChoices(this.props.id);
    }

    render() {
        const channel_choices = this.getChannelChoices();
        const htmode_choices = this.getHtmodeChoices();
        const hwmode_choices = this.getHwmodeChoices();

        const guestWifiForm = this.props.guest_wifi.enabled ? (
            <div>
                <TextInput
                    name='SSID'
                    label='SSID'
                    value={this.props.guest_wifi.SSID}
                    disabled={this.props.disabled}

                    onChange={this.onGuestWifiFormChange}
                />

                <Password
                    name='password'
                    label='Password'
                    value={this.props.guest_wifi.password}
                    helpText={HELP_TEXTS.password}
                    disabled={this.props.disabled}
                    required

                    onChange={this.onGuestWifiFormChange}
                />
            </div>
        ) : null;


        const errors = this.props.errors ? this.props.errors : {};
        const wifiForm = this.props.enabled ? (
            <div>
                <TextInput
                    name='SSID'
                    label='SSID'
                    value={this.props.SSID}
                    disabled={this.props.disabled}
                    error={errors.SSID}
                    required

                    onChange={this.onWifiFormChange}
                />

                <Password
                    name='password'
                    label='Password'
                    value={this.props.password}
                    error={errors.password}
                    helpText={HELP_TEXTS.password}
                    disabled={this.props.disabled}
                    required

                    onChange={this.onWifiFormChange}
                />

                <CheckBox
                    name={'hidden'}
                    label='Hide SSID'
                    helpText={HELP_TEXTS.hidden}
                    checked={this.props.hidden}
                    disabled={this.props.disabled}

                    onChange={this.onWifiFormChange}
                />

                <RadioSet
                    name={'hwmode_' + this.props.id}
                    label='GHz'
                    choices={hwmode_choices}
                    value={this.props.hwmode}
                    disabled={this.props.disabled}
                    helpText={HELP_TEXTS.hwmode}

                    onChange={this.onWifiFormChange}
                />

                <Select
                    name={'htmode'}
                    label='802.11n/ac mode'
                    choices={htmode_choices}
                    value={this.props.htmode}
                    disabled={this.props.disabled}
                    helpText={HELP_TEXTS.htmode}

                    onChange={this.onWifiFormChange}
                />

                <Select
                    name={'channel'}
                    label='Channel'
                    choices={channel_choices}
                    value={this.props.channel}
                    disabled={this.props.disabled}

                    onChange={this.onWifiFormChange}
                />

                <CheckBox
                    name='enabled'
                    label='Enable Guest Wifi'
                    checked={this.props.guest_wifi.enabled}
                    disabled={this.props.disabled}
                    helpText={HELP_TEXTS.guest_wifi_enabled}

                    onChange={this.onGuestWifiFormChange}
                />
                {guestWifiForm}
            </div>
        ) : null;

        return (
            <div>
                <h3>WiFi {this.props.id + 1}</h3>
                <CheckBox
                    name={'enabled'}
                    label='Enable'
                    checked={this.props.enabled}
                    disabled={this.props.disabled}

                    onChange={this.onWifiFormChange}
                />
                {wifiForm}
            </div>
        );
    }
}

export default WifiForm;
