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


export default function WifiForm(props) {
    const errors = props.errors ? props.errors : {};

    return <>
        <h3>Module {props.id + 1}</h3>
        <CheckBox
            label='Enable'
            checked={props.enabled}
            disabled={props.disabled}

            onChange={props.changeFormData(
                value => ({devices: {[props.id]: {enabled: {$set: value}}}})
            )}
        />
        {props.enabled ?
            <>
                <TextInput
                    label='SSID'
                    value={props.SSID}
                    disabled={props.disabled}
                    error={errors.SSID}
                    required

                    onChange={props.changeFormData(
                        value => ({devices: {[props.id]: {SSID: {$set: value}}}})
                    )}
                />

                <Password
                    label='Password'
                    value={props.password}
                    error={errors.password}
                    helpText={HELP_TEXTS.password}
                    disabled={props.disabled}
                    required

                    onChange={props.changeFormData(
                        value => ({devices: {[props.id]: {password: {$set: value}}}})
                    )}
                />

                <CheckBox
                    label='Hide SSID'
                    helpText={HELP_TEXTS.hidden}
                    checked={props.hidden}
                    disabled={props.disabled}

                    onChange={props.changeFormData(
                        value => ({devices: {[props.id]: {hidden: {$set: value}}}})
                    )}
                />

                <RadioSet
                    label='GHz'
                    choices={props.hwmodeChoices}
                    value={props.hwmode}
                    disabled={props.disabled}
                    helpText={HELP_TEXTS.hwmode}

                    onChange={props.changeFormData(
                        value => ({
                            devices: {
                                [props.id]: {
                                    hwmode: {$set: value},
                                    channel: {$set: 0}
                                }
                            }
                        })
                    )}
                />

                <Select
                    label='802.11n/ac mode'
                    choices={props.htmodeChoices}
                    value={props.htmode}
                    disabled={props.disabled}
                    helpText={HELP_TEXTS.htmode}

                    onChange={props.changeFormData(
                        value => ({devices: {[props.id]: {htmode: {$set: value}}}})
                    )}

                />

                <Select
                    label='Channel'
                    choices={props.channelChoices}
                    value={props.channel}
                    disabled={props.disabled}

                    onChange={props.changeFormData(
                        value => ({devices: {[props.id]: {channel: {$set: value}}}})
                    )}
                />

                <WifiGuestForm
                    {...props.guest_wifi}
                    disabled={props.disabled}
                    changeFormData={props.changeFormData}
                />
            </>
            : null}
    </>;
}

function WifiGuestForm(props) {

    return <>
        <CheckBox
            label='Enable Guest Wifi'
            checked={props.enabled}
            disabled={props.disabled}
            helpText={HELP_TEXTS.guest_wifi_enabled}

            onChange={props.changeFormData(
                value => ({devices: {[props.id]: {guest_wifi: {enabled: {$set: value}}}}})
            )}
        />
        {props.enabled ?
            <>
                <TextInput
                    label='SSID'
                    value={props.SSID}
                    disabled={props.disabled}

                    onChange={props.changeFormData(
                        value => ({devices: {[props.id]: {guest_wifi: {SSID: {$set: value}}}}})
                    )}
                />

                <Password
                    label='Password'
                    value={props.guest_wifi.password}
                    helpText={HELP_TEXTS.password}
                    disabled={props.disabled}
                    error={errors.guestWifiPassword}
                    required

                    onChange={props.changeFormData(
                        value => ({devices: {[props.id]: {guest_wifi: {password: {$set: value}}}}})
                    )}
                />
            </>
            : null}
    </>
}
