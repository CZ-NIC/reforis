/*
 * Copyright (C) 2020-2021 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect } from "react";
import PropTypes from "prop-types";

import {
    CheckBox,
    Select,
    useAPIGet,
    withSpinnerOnSending,
    withErrorMessage,
} from "foris";
import API_URLs from "../common/API";

import LANManagedForm from "./LANManagedForm";
import LANUnmanagedForm from "./LANUnmanagedForm";

const HELP_TEXTS = {
    managed: _(
        `Router mode means that this device manages the LAN (acts as a router, can assign IP addresses, etc.).`
    ),
    unmanaged: _(
        `Computer mode means that this device acts as a client in this network.
It acts similarly to WAN, but it has opened ports for configuration interfaces and other services.`
    ),
};

export const LAN_MODES = {
    managed: "managed",
    unmanaged: "unmanaged",
};

const LAN_MOD_CHOICES = {
    managed: _("Router"),
    unmanaged: _("Computer"),
};

export default function LANForm({ ...props }) {
    const [getAboutResponse, getAbout] = useAPIGet(API_URLs.about);

    useEffect(() => {
        getAbout();
    }, [getAbout]);

    return (
        <>
            <h2>{_("LAN Settings")}</h2>
            <LANFormWithErrorAndSpinner
                apiState={getAboutResponse.state}
                deviceDetails={getAboutResponse.data || {}}
                {...props}
            />
        </>
    );
}

LANFormSettings.propTypes = {
    formData: PropTypes.shape({
        mode: PropTypes.string.isRequired,
        mode_managed: PropTypes.object,
        mode_unmanaged: PropTypes.object,
        lan_redirect: PropTypes.bool,
    }),
    formErrors: PropTypes.shape({
        mode_managed: PropTypes.object,
        mode_unmanaged: PropTypes.object,
    }),
    setFormValue: PropTypes.func,
    disabled: PropTypes.bool,
    deviceDetails: PropTypes.object.isRequired,
};

export function LANFormSettings({
    deviceDetails,
    formData,
    formErrors,
    setFormValue,
    disabled,
}) {
    const errors = formErrors || {};
    const lanMode = formData.mode;
    const customization = !!(
        deviceDetails &&
        deviceDetails.customization !== undefined &&
        deviceDetails.customization === "shield"
    );

    let lanForm = null;
    if (lanMode === LAN_MODES.managed) {
        lanForm = (
            <LANManagedForm
                formData={formData.mode_managed}
                formErrors={errors.mode_managed}
                setFormValue={setFormValue}
                disabled={disabled}
            />
        );
    } else if (lanMode === LAN_MODES.unmanaged) {
        lanForm = (
            <LANUnmanagedForm
                formData={formData.mode_unmanaged}
                formErrors={errors.mode_unmanaged}
                setFormValue={setFormValue}
                disabled={disabled}
            />
        );
    }
    return (
        <>
            {!customization && (
                <Select
                    label={_("LAN mode")}
                    value={formData.mode}
                    choices={LAN_MOD_CHOICES}
                    helpText={
                        lanMode === LAN_MODES.managed
                            ? HELP_TEXTS.managed
                            : HELP_TEXTS.unmanaged
                    }
                    onChange={setFormValue((value) => ({
                        mode: { $set: value },
                    }))}
                    disabled={disabled}
                />
            )}
            {Object.hasOwnProperty.call(formData, "lan_redirect") && (
                <CheckBox
                    label={_("Redirect to 192.168.1.1")}
                    checked={formData.lan_redirect}
                    onChange={setFormValue((value) => ({
                        lan_redirect: { $set: value },
                    }))}
                    disabled={disabled}
                />
            )}
            {lanForm}
        </>
    );
}

const LANFormWithErrorAndSpinner = withSpinnerOnSending(
    withErrorMessage(LANFormSettings)
);
