/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react'

import CheckBox from "./bootstrap/Checkbox";
import TextInput from "./bootstrap/TextInput";
import Password from "./bootstrap/Password";
import RadioSet from "./bootstrap/RadioSet";
import Select from "./bootstrap/Select";


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

    getHwmodeChoices(){
        return this.props.getHwmodeChoices(this.props.id)

    }

    render() {
        const channel_choices = this.getChannelChoices();
        const htmode_choices = this.getHtmodeChoices();
        const hwmode_choices = this.getHwmodeChoices();

        const guestWifiForm = this.props.guest_wifi.enabled ? (
            <div>
                <TextInput
                    id={"guest_ssid_" + this.props.id}
                    name="SSID"
                    label="SSID"
                    value={this.props.guest_wifi.SSID}
                    onChange={this.onGuestWifiFormChange}
                />

                <Password
                    id={"guest_password_" + this.props.id}
                    name="password"
                    label="Password"
                    value={this.props.guest_wifi.password}
                    onChange={this.onGuestWifiFormChange}
                />
            </div>
        ) : null;

        const wifiForm = this.props.enabled ? (
            <div>
                <TextInput
                    id={"ssid_" + this.props.id}
                    name="SSID"
                    label="SSID"
                    value={this.props.SSID}
                    onChange={this.onWifiFormChange}
                />

                <Password
                    id={"password_" + this.props.id}
                    name="password"
                    label="Password"
                    value={this.props.password}
                    onChange={this.onWifiFormChange}
                />

                <CheckBox
                    id={"hidden_" + this.props.id}
                    name={"hidden"}
                    label="Hide SSID"
                    checked={this.props.hidden}
                    onChange={this.onWifiFormChange}
                />

                <RadioSet
                    id={"hwmode_" + this.props.id}
                    name="hwmode"
                    label="GHz"
                    choices={hwmode_choices}
                    value={this.props.hwmode}
                    onChange={this.onWifiFormChange}
                />

                <Select
                    id={"htmode_" + this.props.id}
                    name={"htmode"}
                    label="802.11n/ac mode"
                    choices={htmode_choices}
                    value={this.props.htmode}
                    onChange={this.onWifiFormChange}
                />

                <Select
                    id={"channel_" + this.props.id}
                    name={"channel"}
                    label="Channel"
                    choices={channel_choices}
                    value={this.props.channel}
                    onChange={this.onWifiFormChange}
                />

                <CheckBox
                    id={"guest_wifi_enabled_" + this.props.id}
                    name="enabled"
                    label="Enable Guest Wifi"
                    checked={this.props.guest_wifi.enabled}
                    onChange={this.onGuestWifiFormChange}
                />
                {guestWifiForm}
            </div>
        ) : null;
        return (
            <div>
                <h3>WiFi {this.props.id + 1}</h3>
                <CheckBox
                    id={"wifi_enabled_" + this.props.id}
                    name={"enabled"}
                    label="Enable"
                    checked={this.props.enabled}
                    onChange={this.onWifiFormChange}
                />
                {wifiForm}
            </div>
        );
    }
}

export default WifiForm;
