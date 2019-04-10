/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */
import React from 'react'

import TextInput from '../bootstrap/TextInput';
import PasswordInput from '../bootstrap/PasswordInput';
import CheckBox from '../bootstrap/Checkbox';
import RadioSet from '../bootstrap/RadioSet';
import Select from '../bootstrap/Select';

const HTMODES = {
    NOHT: _('Disabled'),
    HT20: _('802.11n - 20 MHz wide channel'),
    HT40: _('802.11n - 40 MHz wide channel'),
    VHT20: _('802.11ac - 20 MHz wide channel'),
    VHT40: _('802.11ac - 40 MHz wide channel'),
    VHT80: _('802.11ac - 80 MHz wide channel'),
};

const HWMODES = {
    '11g': '2.4',
    '11a': '5'
};

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
    return props.formData.devices.map(device =>
        <DeviceForm
            key={device.id}
            formData={device}
            errors={(props.formErrors || [])[device.id] || null}
            setFormValue={props.setFormValue}
            disabled={props.disabled}
        />
    )
}

function DeviceForm(props) {
    const errors = props.errors ? props.errors : {};
    const deviceID = props.formData.id;
    return <>
        <h3>Module {deviceID + 1}</h3>
        <CheckBox
            label={_('Enable')}
            checked={props.formData.enabled}
            disabled={props.disabled}

            onChange={props.setFormValue(
                value => ({devices: {[deviceID]: {enabled: {$set: value}}}})
            )}
        />
        {props.formData.enabled ?
            <>
                <TextInput
                    label='SSID'
                    value={props.formData.SSID}
                    disabled={props.disabled}
                    error={errors.SSID}
                    required

                    onChange={props.setFormValue(
                        value => ({devices: {[deviceID]: {SSID: {$set: value}}}})
                    )}
                />

                <PasswordInput
                    label='Password'
                    value={props.formData.password}
                    error={errors.password}
                    helpText={HELP_TEXTS.password}
                    disabled={props.disabled}
                    required

                    onChange={props.setFormValue(
                        value => ({devices: {[deviceID]: {password: {$set: value}}}})
                    )}
                />

                <CheckBox
                    label='Hide SSID'
                    helpText={HELP_TEXTS.hidden}
                    checked={props.formData.hidden}
                    disabled={props.disabled}

                    onChange={props.setFormValue(
                        value => ({devices: {[deviceID]: {hidden: {$set: value}}}})
                    )}
                />

                <RadioSet
                    name={`hwmode-${deviceID}`}
                    label='GHz'
                    choices={getHwmodeChoices(props.formData)}
                    value={props.formData.hwmode}
                    disabled={props.disabled}
                    helpText={HELP_TEXTS.hwmode}

                    onChange={props.setFormValue(
                        value => ({
                            devices: {
                                [deviceID]: {
                                    hwmode: {$set: value},
                                    channel: {$set: 0}
                                }
                            }
                        })
                    )}
                />

                <Select
                    label='802.11n/ac mode'
                    choices={getHtmodeChoices(props.formData)}
                    value={props.formData.htmode}
                    disabled={props.disabled}
                    helpText={HELP_TEXTS.htmode}

                    onChange={props.setFormValue(
                        value => ({devices: {[deviceID]: {htmode: {$set: value}}}})
                    )}

                />

                <Select
                    label='Channel'
                    choices={getChannelChoices(props.formData)}
                    value={props.formData.channel}
                    disabled={props.disabled}

                    onChange={props.setFormValue(
                        value => ({devices: {[deviceID]: {channel: {$set: value}}}})
                    )}
                />

                <WifiGuestForm
                    formData={props.formData.guest_wifi}
                    disabled={props.disabled}
                    setFormValue={props.setFormValue}
                />
            </>
            : null}
    </>;
}

//TODO doesn't get ID!!!
function WifiGuestForm(props) {
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
                    value={props.formData.guest_wifi.password}
                    helpText={HELP_TEXTS.password}
                    disabled={props.disabled}
                    error={errors.guestWifiPassword}
                    required

                    onChange={props.setFormValue(
                        value => ({devices: {[props.formData.id]: {guest_wifi: {password: {$set: value}}}}})
                    )}
                />
            </>
            : null}
    </>
}

function getChannelChoices(device) {
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
}

function getHtmodeChoices(device) {
    let htmodeChoices = {};

    device.available_bands.forEach((availableBand) => {
        if (availableBand.hwmode !== device.hwmode)
            return;

        availableBand.available_htmodes.forEach((availableHtmod) => {
            htmodeChoices[availableHtmod] = HTMODES[availableHtmod]
        })
    });
    return htmodeChoices
}

function getHwmodeChoices(device) {
    return device.available_bands.map((availableBand) => {
        return {
            label: HWMODES[availableBand.hwmode],
            value: availableBand.hwmode,
        }
    });
}