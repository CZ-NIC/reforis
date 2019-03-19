/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react'

import CheckBox from "../bootstrap/Checkbox";
import TextInput from "../bootstrap/TextInput";
import Password from "../bootstrap/Password";
import RadioSet from "../bootstrap/RadioSet";
import Select from "../bootstrap/Select";


class WifiForm extends React.Component {
    onWifiFormChange = (event) => {
        this.props.onWifiFormChange(this.props.id, event.target)
    };

    onGuestWifiFormChange = (event) => {
        this.props.onGuestWifiFormChange(this.props.id, event.target)
    };

    getChannelChoices() {
        return this.props.getChannelChoices(this.props.id)
    };

    getHtmodeChoices() {
        return this.props.getHtmodeChoices(this.props.id)
    }

    getHwmodeChoices() {
        return this.props.getHwmodeChoices(this.props.id)

    }

    render() {
        const channel_choices = this.getChannelChoices();
        const htmode_choices = this.getHtmodeChoices();
        const hwmode_choices = this.getHwmodeChoices();

        const guestWifiForm = this.props.guest_wifi.enabled ? (
            <div>
                <TextInput
                    name="SSID"
                    label="SSID"
                    value={this.props.guest_wifi.SSID}
                    onChange={this.onGuestWifiFormChange}
                    disabled={this.props.disabled}
                />

                <Password
                    name="password"
                    label="Password"
                    value={this.props.guest_wifi.password}
                    onChange={this.onGuestWifiFormChange}
                    disabled={this.props.disabled}
                />
            </div>
        ) : null;


        const errors = this.props.errors ? this.props.errors : {};
        const wifiForm = this.props.enabled ? (
            <div>
                <TextInput
                    name="SSID"
                    label="SSID"
                    value={this.props.SSID}
                    onChange={this.onWifiFormChange}
                    disabled={this.props.disabled}
                    error={errors.SSID}
                    required
                />

                <Password
                    name="password"
                    label="Password"
                    value={this.props.password}
                    onChange={this.onWifiFormChange}
                    disabled={this.props.disabled}
                    error={errors.password}
                    required
                />

                <CheckBox
                    name={"hidden"}
                    label="Hide SSID"
                    checked={this.props.hidden}
                    onChange={this.onWifiFormChange}
                    disabled={this.props.disabled}
                />

                <RadioSet
                    name={"hwmode_" + this.props.id}
                    label="GHz"
                    choices={hwmode_choices}
                    value={this.props.hwmode}
                    onChange={this.onWifiFormChange}
                    disabled={this.props.disabled}
                />

                <Select
                    name={"htmode"}
                    label="802.11n/ac mode"
                    choices={htmode_choices}
                    value={this.props.htmode}
                    onChange={this.onWifiFormChange}
                    disabled={this.props.disabled}
                />

                <Select
                    name={"channel"}
                    label="Channel"
                    choices={channel_choices}
                    value={this.props.channel}
                    onChange={this.onWifiFormChange}
                    disabled={this.props.disabled}
                />

                <CheckBox
                    name="enabled"
                    label="Enable Guest Wifi"
                    checked={this.props.guest_wifi.enabled}
                    onChange={this.onGuestWifiFormChange}
                    disabled={this.props.disabled}
                />
                {guestWifiForm}
            </div>
        ) : null;

        return (
            <div>
                <h3>WiFi {this.props.id + 1}</h3>
                <CheckBox
                    name={"enabled"}
                    label="Enable"
                    checked={this.props.enabled}
                    onChange={this.onWifiFormChange}
                    disabled={this.props.disabled}
                />
                {wifiForm}
            </div>
        );
    }
}

export default WifiForm;
