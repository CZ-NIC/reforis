/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import { TextInput, validateIPv4Address } from "foris";

const HELP_TEXTS = {
    dns: _(
        "DNS server address is not required as the built-in DNS resolver is capable of working without it."
    ),
};

const FIELDS_PROP_TYPES = {
    ip: PropTypes.string,
    netmask: PropTypes.string,
    gateway: PropTypes.string,
    dns1: PropTypes.string,
    dns2: PropTypes.string,
};

StaticIPForm.propTypes = {
    formData: PropTypes.shape(FIELDS_PROP_TYPES).isRequired,
    formErrors: PropTypes.shape(FIELDS_PROP_TYPES),
    setFormValue: PropTypes.func.isRequired,
    updateRule: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

StaticIPForm.defaultProps = {
    formData: {},
    formErrors: {},
};

export default function StaticIPForm({
    formData,
    formErrors,
    updateRule,
    setFormValue,
    disabled,
}) {
    return (
        <>
            <TextInput
                label={_("IP address")}
                value={formData.ip || ""}
                error={formErrors.ip || null}
                required
                onChange={setFormValue((value) =>
                    updateRule({ ip: { $set: value } })
                )}
                disabled={disabled}
            />
            <TextInput
                label={_("Network mask")}
                value={formData.netmask || ""}
                error={formErrors.netmask || null}
                required
                onChange={setFormValue((value) =>
                    updateRule({ netmask: { $set: value } })
                )}
                disabled={disabled}
            />
            <TextInput
                label={_("Gateway")}
                value={formData.gateway || ""}
                error={formErrors.gateway || null}
                required
                onChange={setFormValue((value) =>
                    updateRule({ gateway: { $set: value } })
                )}
                disabled={disabled}
            />
            <TextInput
                label={_("DNS server 1")}
                value={formData.dns1 || ""}
                error={formErrors.dns1 || null}
                helpText={HELP_TEXTS.dns}
                onChange={setFormValue((value) =>
                    updateRule({ dns1: { $set: value } })
                )}
                disabled={disabled}
            />
            <TextInput
                label={_("DNS server 2")}
                value={formData.dns2 || ""}
                error={formErrors.dns2 || null}
                helpText={HELP_TEXTS.dns}
                onChange={setFormValue((value) =>
                    updateRule({ dns2: { $set: value } })
                )}
                disabled={disabled}
            />
        </>
    );
}

export function validateStaticForm(formData) {
    const errors = {};
    ["ip", "netmask", "gateway", "dns1", "dns2"].forEach((field) => {
        const error = validateIPv4Address(formData[field]);
        if (error) errors[field] = error;
    });
    ["ip", "netmask", "gateway"].forEach((field) => {
        if (!formData[field] || formData[field] === "")
            errors[field] = _("This field is required.");
    });

    return JSON.stringify(errors) !== "{}" ? errors : null;
}
