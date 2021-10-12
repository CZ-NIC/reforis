/*
 * Copyright (C) 2019-2021 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import { Select } from "foris";
import DHCPClientForm, {
    validateDHCPForm,
} from "common/network/DHCPClientForm";
import StaticIPForm, { validateStaticForm } from "common/network/StaticIPForm";

const LAN_TYPES = {
    dhcp: "dhcp",
    static: "static",
    none: "none",
};

const LAN_TYPE_CHOICES = {
    dhcp: _("DHCP (automatic configuration)"),
    static: _("Static IP address (manual configuration)"),
    none: _("Don't connect this device to LAN"),
};

LANUnmanagedForm.propTypes = {
    formData: PropTypes.shape({
        lan_type: PropTypes.oneOf(Object.keys(LAN_TYPES)),
        lan_dhcp: PropTypes.object,
        lan_static: PropTypes.object,
    }).isRequired,
    formErrors: PropTypes.shape({
        lan_dhcp: PropTypes.object,
        lan_static: PropTypes.object,
    }),
    setFormValue: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

LANUnmanagedForm.defaultProps = {
    formData: {},
    formErrors: {},
};

export default function LANUnmanagedForm({
    formData,
    formErrors,
    setFormValue,
    disabled,
}) {
    const lanType = formData.lan_type;

    let lanForm = null;
    if (lanType === LAN_TYPES.dhcp) {
        lanForm = (
            <DHCPClientForm
                formData={formData.lan_dhcp}
                formErrors={formErrors.lan_dhcp}
                updateRule={(value) => ({
                    mode_unmanaged: { lan_dhcp: value },
                })}
                setFormValue={setFormValue}
                disabled={disabled}
            />
        );
    } else if (lanType === LAN_TYPES.static) {
        lanForm = (
            <StaticIPForm
                formData={formData.lan_static}
                formErrors={formErrors.lan_static}
                updateRule={(value) => ({
                    mode_unmanaged: { lan_static: value },
                })}
                setFormValue={setFormValue}
                disabled={disabled}
            />
        );
    }

    return (
        <>
            <Select
                label={_("IPv4 protocol")}
                value={lanType}
                choices={LAN_TYPE_CHOICES}
                onChange={setFormValue((value) => ({
                    mode_unmanaged: { lan_type: { $set: value } },
                }))}
                disabled={disabled}
                customOrder
            />
            {lanForm}
        </>
    );
}

export function validateUnmanaged(formData) {
    const errors = {};
    if (formData.lan_type === LAN_TYPES.dhcp) {
        errors.lan_dhcp = validateDHCPForm(formData.lan_dhcp);
    } else if (formData.lan_type === LAN_TYPES.static) {
        errors.lan_static = validateStaticForm(formData.lan_static);
    }

    return errors[`lan_${formData.lan_type}`] ? errors : undefined;
}
