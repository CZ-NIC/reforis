/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import { CheckBox } from "foris";
import { TextInput } from "foris";
import { validateMAC } from "foris";

const HELP_TEXTS = {
    custom_mac_enabled: _("Useful in cases, when a specific MAC address is required by your internet service provider."),
    custom_mac: _("Colon is used as a separator, for example 00:11:22:33:44:55"),
};

MACForm.propTypes = {
    formData: PropTypes.shape({
        mac_settings: PropTypes.shape({
            custom_mac_enabled: PropTypes.bool.isRequired,
            custom_mac: PropTypes.string,
        }),
    }).isRequired,
    formErrors: PropTypes.shape({
        custom_mac: PropTypes.string,
    }),
    setFormValue: PropTypes.func.isRequired,
};

MACForm.defaultProps = {
    setFormValue: () => {
    },
    formData: {},
};

export default function MACForm({
    formData, formErrors, setFormValue, ...props
}) {
    const macSettings = formData.mac_settings;
    const errors = (formErrors || {}).mac_settings || {};
    return (
        <>
            <h3>{_("MAC")}</h3>
            <CheckBox
                label={_("Custom MAC address")}
                checked={macSettings.custom_mac_enabled}
                helpText={HELP_TEXTS.custom_mac_enabled}

                onChange={setFormValue(
                    (value) => ({ mac_settings: { custom_mac_enabled: { $set: value } } }),
                )}

                {...props}
            />
            {macSettings.custom_mac_enabled
                ? (
                    <TextInput
                        label={_("MAC address")}
                        value={macSettings.custom_mac || ""}
                        helpText={HELP_TEXTS.custom_mac}
                        error={errors.custom_mac}
                        required

                        onChange={setFormValue(
                            (value) => ({ mac_settings: { custom_mac: { $set: value } } }),
                        )}

                        {...props}
                    />
                )
                : null}
        </>
    );
}

export function validateMACForm(formData) {
    if (formData.custom_mac_enabled && (!formData.custom_mac || formData.custom_mac === "")) return { custom_mac: _("This field is required.") };

    const error = { custom_mac: validateMAC(formData.custom_mac) };
    return error.custom_mac ? error : null;
}
