/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import {
    TextInput, CheckBox, validateIPv4Address, undefinedIfEmpty, withoutUndefinedKeys,
} from "foris";

import DHCPServerForm, { HELP_TEXT as DHCP_HELP_TEXT } from "common/network/DHCPServerForm";
import { validateNetworkMask, validateRequiredField } from "common/network/validators";
import validateDHCP from "common/network/DHCPValidators";

const HELP_TEXTS = {
    router_ip: _("Router's IP address in the inner network."),
    dhcp: DHCP_HELP_TEXT,
};

LANManagedForm.propTypes = {
    formData: PropTypes.shape({
        router_ip: PropTypes.string.isRequired,
        netmask: PropTypes.string,
        dhcp: PropTypes.object,
    }).isRequired,
    formErrors: PropTypes.shape({
        mode_managed: PropTypes.object,
        mode_unmanaged: PropTypes.object,
    }),
    setFormValue: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

LANManagedForm.defaultProps = {
    formData: {},
};

export default function LANManagedForm({
    formData, formErrors, setFormValue, disabled,
}) {
    const errors = (formErrors || {});
    return (
        <>
            <TextInput
                label={_("Router IP address")}
                value={formData.router_ip || ""}
                error={errors.router_ip || null}
                helpText={HELP_TEXTS.router_ip}
                required

                onChange={setFormValue(
                    (value) => ({ mode_managed: { router_ip: { $set: value } } }),
                )}

                disabled={disabled}
            />
            <TextInput
                label={_("Network mask")}
                value={formData.netmask || ""}
                error={errors.netmask || null}
                required

                onChange={setFormValue(
                    (value) => ({ mode_managed: { netmask: { $set: value } } }),
                )}

                disabled={disabled}
            />
            <CheckBox
                label={_("Enable DHCP")}
                checked={formData.dhcp.enabled}
                helpText={HELP_TEXTS.dhcp}

                onChange={setFormValue(
                    (value) => ({ mode_managed: { dhcp: { enabled: { $set: value } } } }),
                )}

                disabled={disabled}
            />
            {formData.dhcp.enabled && (
                <DHCPServerForm
                    formData={formData.dhcp}
                    formErrors={errors.dhcp ? errors.dhcp : {}}
                    updateRule={(value) => ({ mode_managed: { dhcp: value } })}
                    setFormValue={setFormValue}

                    disabled={disabled}
                />
            )}
        </>
    );
}

export function validateManaged(formData) {
    const errors = {
        router_ip: (
            validateRequiredField(formData.router_ip)
            || validateIPv4Address(formData.router_ip)
        ),
        netmask: (
            validateRequiredField(formData.netmask)
            || validateIPv4Address(formData.netmask)
            || validateNetworkMask(formData.netmask)
        ),
    };
    if (formData.dhcp.enabled) {
        errors.dhcp = validateDHCP(
            formData.dhcp,
            formData.router_ip,
            formData.netmask,
            errors.router_ip || errors.netmask,
        );
    }
    return undefinedIfEmpty(withoutUndefinedKeys(errors));
}
