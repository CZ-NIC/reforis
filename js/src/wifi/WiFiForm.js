/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";
import {
    CheckBox, PasswordInput, RadioSet, Select, TextInput,
} from "foris";

import WiFiQRCode from "./WiFiQRCode";
import WifiGuestForm from "./WiFiGuestForm";
import { HELP_TEXTS, HTMODES, HWMODES } from "./constants";

WiFiForm.propTypes = {
    formData: PropTypes.shape(
        { devices: PropTypes.arrayOf(PropTypes.object) },
    ).isRequired,
    formErrors: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array,
    ]),
    setFormValue: PropTypes.func.isRequired,
};

WiFiForm.defaultProps = {
    formData: { devices: [] },
    setFormValue: () => {
    },
};

export default function WiFiForm({
    formData, formErrors, setFormValue, ...props
}) {
    return formData.devices.map((device) => (
        <DeviceForm
            key={device.id}
            formData={device}
            formErrors={(formErrors || [])[device.id]}

            setFormValue={setFormValue}

            {...props}
        />
    ));
}

DeviceForm.propTypes = {
    formData: PropTypes.shape({
        id: PropTypes.number.isRequired,
        enabled: PropTypes.bool.isRequired,
        SSID: PropTypes.string.isRequired,
        password: PropTypes.string.isRequired,
        hidden: PropTypes.bool.isRequired,
        hwmode: PropTypes.string.isRequired,
        htmode: PropTypes.string.isRequired,
        channel: PropTypes.string.isRequired,
        guest_wifi: PropTypes.object.isRequired,
    }),
    formErrors: PropTypes.object.isRequired,
    setFormValue: PropTypes.func.isRequired,
};

DeviceForm.defaultProps = {
    formErrors: {},
};

function DeviceForm({
    formData, formErrors, setFormValue, ...props
}) {
    const deviceID = formData.id;
    return (
        <>
            <h3>{_(`Wi-Fi ${deviceID + 1}`)}</h3>
            <CheckBox
                label={_("Enable")}
                checked={formData.enabled}

                onChange={setFormValue(
                    (value) => ({ devices: { [deviceID]: { enabled: { $set: value } } } }),
                )}

                {...props}
            />
            {formData.enabled
                ? (
                    <>
                        <TextInput
                            label="SSID"
                            value={formData.SSID}
                            error={formErrors.SSID || null}
                            required
                            onChange={setFormValue(
                                (value) => ({ devices: { [deviceID]: { SSID: { $set: value } } } }),
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
                            withEye
                            label="Password"
                            value={formData.password}
                            error={formErrors.password}
                            helpText={HELP_TEXTS.password}
                            required

                            onChange={setFormValue(
                                (value) => (
                                    { devices: { [deviceID]: { password: { $set: value } } } }
                                ),
                            )}

                            {...props}
                        />

                        <CheckBox
                            label="Hide SSID"
                            helpText={HELP_TEXTS.hidden}
                            checked={formData.hidden}

                            onChange={setFormValue(
                                (value) => (
                                    { devices: { [deviceID]: { hidden: { $set: value } } } }
                                ),
                            )}

                            {...props}
                        />

                        <RadioSet
                            name={`hwmode-${deviceID}`}
                            label="GHz"
                            choices={getHwmodeChoices(formData)}
                            value={formData.hwmode}
                            helpText={HELP_TEXTS.hwmode}

                            onChange={setFormValue(
                                (value) => ({
                                    devices: {
                                        [deviceID]: {
                                            hwmode: { $set: value },
                                            channel: { $set: "0" },
                                        },
                                    },
                                }),
                            )}

                            {...props}
                        />

                        <Select
                            label="802.11n/ac mode"
                            choices={getHtmodeChoices(formData)}
                            value={formData.htmode}
                            helpText={HELP_TEXTS.htmode}

                            onChange={setFormValue(
                                (value) => (
                                    { devices: { [deviceID]: { htmode: { $set: value } } } }
                                ),
                            )}

                            {...props}
                        />

                        <Select
                            label="Channel"
                            choices={getChannelChoices(formData)}
                            value={formData.channel}

                            onChange={setFormValue(
                                (value) => (
                                    { devices: { [deviceID]: { channel: { $set: value } } } }
                                ),
                            )}

                            {...props}
                        />

                        <WifiGuestForm
                            formData={{ id: deviceID, ...formData.guest_wifi }}
                            formErrors={formErrors.guest_wifi || {}}

                            setFormValue={setFormValue}

                            {...props}
                        />
                    </>
                )
                : null}
        </>
    );
}

function getChannelChoices(device) {
    const channelChoices = {
        0: _("auto"),
    };

    device.available_bands.forEach((availableBand) => {
        if (availableBand.hwmode !== device.hwmode) return;

        availableBand.available_channels.forEach((availableChannel) => {
            channelChoices[availableChannel.number.toString()] = `
                        ${availableChannel.number}
                        (${availableChannel.frequency} MHz ${availableChannel.radar ? " ,DFS" : ""})
                    `;
        });
    });

    return channelChoices;
}

function getHtmodeChoices(device) {
    const htmodeChoices = {};

    device.available_bands.forEach((availableBand) => {
        if (availableBand.hwmode !== device.hwmode) return;

        availableBand.available_htmodes.forEach((availableHtmod) => {
            htmodeChoices[availableHtmod] = HTMODES[availableHtmod];
        });
    });
    return htmodeChoices;
}

function getHwmodeChoices(device) {
    return device.available_bands.map((availableBand) => ({
        label: HWMODES[availableBand.hwmode],
        value: availableBand.hwmode,
    }));
}
