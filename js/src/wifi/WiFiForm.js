/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react'
import propTypes from 'prop-types';

import TextInput from '../common/bootstrap/TextInput';
import PasswordInput from '../common/bootstrap/PasswordInput';
import CheckBox from '../common/bootstrap/Checkbox';
import RadioSet from '../common/bootstrap/RadioSet';
import Select from '../common/bootstrap/Select';

import WiFiQRCode from './WiFiQRCode';
import WifiGuestForm from './WiFiGuestForm';

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

export const HELP_TEXTS = {
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

WiFiForm.propTypes = {
    formData: propTypes.shape(
        {devices: propTypes.arrayOf(propTypes.object)}
    ).isRequired,
    formErrors: propTypes.oneOfType([
        propTypes.object,
        propTypes.array
    ]),
    setFormValue: propTypes.func.isRequired,
};

WiFiForm.defaultProps = {
    formData: {devices: []},
    setFormValue: () => {
    }
};

export default function WiFiForm({formData, formErrors, setFormValue, ...props}) {
    return formData.devices.map(device =>
        <DeviceForm
            key={device.id}
            formData={device}
            formErrors={(formErrors || [])[device.id]}

            setFormValue={setFormValue}

            {...props}
        />
    )
}

DeviceForm.propTypes = {
    formData: propTypes.shape({
        id: propTypes.number.isRequired,
        enabled: propTypes.bool.isRequired,
        SSID: propTypes.string.isRequired,
        password: propTypes.string.isRequired,
        hidden: propTypes.bool.isRequired,
        hwmode: propTypes.string.isRequired,
        htmode: propTypes.string.isRequired,
        channel: propTypes.string.isRequired,
        guest_wifi: propTypes.object.isRequired,
    }),
    formErrors: propTypes.object.isRequired,
    setFormValue: propTypes.func.isRequired,
};

DeviceForm.defaultProps = {
    formErrors: {},
};

function DeviceForm({formData, formErrors, setFormValue, ...props}) {
    const deviceID = formData.id;
    return <>
        <h3>{_(`Wi-Fi ${deviceID + 1}`)}</h3>
        <CheckBox
            label={_('Enable')}
            checked={formData.enabled}

            onChange={setFormValue(
                value => ({devices: {[deviceID]: {enabled: {$set: value}}}})
            )}

            {...props}
        />
        {formData.enabled ?
            <>
                <TextInput
                    label='SSID'
                    value={formData.SSID}
                    error={formErrors.SSID || null}
                    required
                    onChange={setFormValue(
                        value => ({devices: {[deviceID]: {SSID: {$set: value}}}})
                    )}

                    {...props}
                >
                    <div className="input-group-append">
                        <WiFiQRCode
                            SSID={formData.SSID}
                            password={formData.password}
                        />
                    </div>
                </TextInput>

                <PasswordInput
                    withEye={true}
                    label='Password'
                    value={formData.password}
                    error={formErrors.password}
                    helpText={HELP_TEXTS.password}
                    required

                    onChange={setFormValue(
                        value => ({devices: {[deviceID]: {password: {$set: value}}}})
                    )}

                    {...props}
                />


                <CheckBox
                    label='Hide SSID'
                    helpText={HELP_TEXTS.hidden}
                    checked={formData.hidden}

                    onChange={setFormValue(
                        value => ({devices: {[deviceID]: {hidden: {$set: value}}}})
                    )}

                    {...props}
                />

                <RadioSet
                    name={`hwmode-${deviceID}`}
                    label='GHz'
                    choices={getHwmodeChoices(formData)}
                    value={formData.hwmode}
                    helpText={HELP_TEXTS.hwmode}

                    onChange={setFormValue(
                        value => ({
                            devices: {
                                [deviceID]: {
                                    hwmode: {$set: value},
                                    channel: {$set: '0'}
                                }
                            }
                        })
                    )}

                    {...props}
                />

                <Select
                    label='802.11n/ac mode'
                    choices={getHtmodeChoices(formData)}
                    value={formData.htmode}
                    helpText={HELP_TEXTS.htmode}

                    onChange={setFormValue(
                        value => ({devices: {[deviceID]: {htmode: {$set: value}}}})
                    )}

                    {...props}
                />

                <Select
                    label='Channel'
                    choices={getChannelChoices(formData)}
                    value={formData.channel}

                    onChange={setFormValue(
                        value => ({devices: {[deviceID]: {channel: {$set: value}}}})
                    )}

                    {...props}
                />

                <WifiGuestForm
                    formData={{id: deviceID, ...formData.guest_wifi}}
                    formErrors={formErrors.guest_wifi || {}}

                    setFormValue={setFormValue}

                    {...props}
                />
            </>
            : null}
    </>;
}

function getChannelChoices(device) {
    let channelChoices = {
        '0': _('auto'),
    };

    device.available_bands.forEach((availableBand) => {
        if (availableBand.hwmode !== device.hwmode) return;

        availableBand.available_channels.forEach((availableChannel) => {
            channelChoices[availableChannel.number.toString()] = `
                        ${availableChannel.number}
                        (${availableChannel.frequency} MHz ${availableChannel.radar ? ' ,DFS' : ''})
                    `;
        })
    });

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
