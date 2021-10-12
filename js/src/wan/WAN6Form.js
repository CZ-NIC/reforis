/*
 * Copyright (C) 2019-2021 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

/* eslint-disable no-underscore-dangle */

import React from "react";
import PropTypes from "prop-types";

import {
    Select,
    TextInput,
    CheckBox,
    NumberInput,
    validateDUID,
    validateIPv4Address,
    validateIPv6Address,
    validateIPv6Prefix,
} from "foris";

const HELP_TEXTS = {
    dhcpv6: {
        duid: _("DUID which will be provided to the DHCPv6 server."),
    },

    static: {
        ip: _(
            "IPv6 address and prefix length for WAN interface e.g. 2001:db8:be13:37da::1/64"
        ),
        network: _(
            "Address range for local network, e.g. 2001:db8:be13:37da::/64"
        ),
        dns: _(
            "DNS server address is not required as the built-in DNS resolver is capable of working without it."
        ),
    },

    "6to4": {
        ipv4_address: _(
            "In order to use 6to4 protocol, you might need to specify your public IPv4 address " +
                "manually (e.g. when your WAN interface has a private address which is mapped to public IP)."
        ),
    },

    "6in4": {
        server_ipv4: _(
            "This address will be used as a endpoint of the tunnel on the provider's side."
        ),
        ipv6_prefix: _("IPv6 addresses which will be routed to your network."),
        mtu: _("Maximum Transmission Unit in the tunnel (in bytes)."),

        dynamic_ipv4: {
            enabled: _(
                "Some tunnel providers allow you to have public dynamic IPv4. Note that you need to " +
                    "fill in some extra fields to make it work."
            ),
            tunnel_id: _(
                "ID of your tunnel which was assigned to you by the provider."
            ),
            username: _(
                "Username which will be used to provide credentials to your tunnel provider."
            ),
            password_or_key: _(
                "Key which will be used to provide credentials to your tunnel provider."
            ),
        },
    },
};

const WAN6_CHOICES = {
    dhcpv6: _("DHCPv6 (automatic configuration)"),
    static: _("Static IP address (manual configuration)"),
    "6to4": _("6to4 (public IPv4 address required)"),
    "6in4": _("6in4 (public IPv4 address required)"),
    none: _("Disable IPv6"),
};

const FIELDS_PROP_TYPES = {
    last_seen_duid: PropTypes.string,
    wan6_dhcpv6: PropTypes.object,
    wan6_static: PropTypes.object,
    wan6_6to4: PropTypes.object,
    wan6_6in4: PropTypes.object,
};

WAN6Form.propTypes = {
    formData: PropTypes.shape({
        wan6_settings: PropTypes.shape({
            wan6_type: PropTypes.string.isRequired,
            ...FIELDS_PROP_TYPES,
        }),
    }).isRequired,
    formErrors: PropTypes.shape(FIELDS_PROP_TYPES),
    setFormValue: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

WAN6Form.defaultProps = {
    setFormValue: () => {},
    formData: {},
};

export default function WAN6Form({
    formData,
    formErrors,
    setFormValue,
    disabled,
}) {
    /* eslint-disable react/prop-types */
    const wan6Settings = formData.wan6_settings;
    const wan6Type = wan6Settings.wan6_type;
    const { last_seen_duid } = wan6Settings;
    const errors = (formErrors || {}).wan6_settings || {};

    let wanForm = null;
    if (wan6Type === "dhcpv6") {
        wanForm = (
            <DHCPv6Form
                formData={wan6Settings.wan6_dhcpv6}
                formErrors={errors.wan6_dhcpv6}
                last_seen_duid={last_seen_duid}
                disabled={disabled}
                setFormValue={setFormValue}
            />
        );
    } else if (wan6Type === "static") {
        wanForm = (
            <StaticForm
                formData={wan6Settings.wan6_static}
                formErrors={errors.wan6_static}
                setFormValue={setFormValue}
                disabled={disabled}
            />
        );
    } else if (wan6Type === "6to4") {
        wanForm = (
            // eslint-disable-next-line react/jsx-pascal-case
            <_6to4Form
                formData={wan6Settings.wan6_6to4}
                formErrors={errors.wan6_6to4}
                setFormValue={setFormValue}
                disabled={disabled}
            />
        );
    } else if (wan6Type === "6in4") {
        wanForm = (
            // eslint-disable-next-line react/jsx-pascal-case
            <_6in4Form
                formData={wan6Settings.wan6_6in4}
                formErrors={errors.wan6_6in4}
                setFormValue={setFormValue}
                disabled={disabled}
            />
        );
    }

    return (
        <>
            <h2>{_("IPv6 Settings")}</h2>
            <Select
                label={_("IPv6 protocol")}
                value={wan6Type}
                choices={WAN6_CHOICES}
                onChange={setFormValue((value) => ({
                    wan6_settings: { wan6_type: { $set: value } },
                }))}
                disabled={disabled}
                customOrder
            />
            {wanForm}
        </>
    );
}

DHCPv6Form.propTypes = {
    last_seen_duid: PropTypes.string,
    formData: PropTypes.shape({ duid: PropTypes.string }).isRequired,
    formErrors: PropTypes.shape({ duid: PropTypes.string }),
    setFormValue: PropTypes.func.isRequired,
};

DHCPv6Form.defaultProps = {
    formErrors: {},
};

function DHCPv6Form({
    formData,
    last_seen_duid,
    formErrors,
    setFormValue,
    disabled,
}) {
    return (
        <TextInput
            label={_("Custom DUID")}
            value={formData.duid || ""}
            error={formErrors.duid || null}
            helpText={HELP_TEXTS.dhcpv6.duid}
            placeholder={last_seen_duid}
            onChange={setFormValue((value) => ({
                wan6_settings: { wan6_dhcpv6: { duid: { $set: value } } },
            }))}
            disabled={disabled}
        />
    );
}

const STATIC_FIELDS_PROPS_TYPES = {
    ip: PropTypes.string,
    gateway: PropTypes.string,
    network: PropTypes.string,
    dns1: PropTypes.string,
    dns2: PropTypes.string,
};

StaticForm.propTypes = {
    formData: PropTypes.shape(STATIC_FIELDS_PROPS_TYPES).isRequired,
    formErrors: PropTypes.shape(STATIC_FIELDS_PROPS_TYPES),
    setFormValue: PropTypes.func.isRequired,
};

StaticForm.defaultProps = {
    formErrors: {},
};

function StaticForm({ formData, formErrors, setFormValue, disabled }) {
    return (
        <>
            <TextInput
                label={_("Address")}
                value={formData.ip || ""}
                helpText={HELP_TEXTS.static.ip}
                error={formErrors.ip || null}
                required
                onChange={setFormValue((value) => ({
                    wan6_settings: { wan6_static: { ip: { $set: value } } },
                }))}
                disabled={disabled}
            />
            <TextInput
                label={_("Gateway")}
                value={formData.gateway || ""}
                error={formErrors.gateway || null}
                required
                onChange={setFormValue((value) => ({
                    wan6_settings: {
                        wan6_static: { gateway: { $set: value } },
                    },
                }))}
                disabled={disabled}
            />
            <TextInput
                label={_("Prefix")}
                value={formData.network || ""}
                helpText={HELP_TEXTS.static.network}
                error={formErrors.network || null}
                required
                onChange={setFormValue((value) => ({
                    wan6_settings: {
                        wan6_static: { network: { $set: value } },
                    },
                }))}
                disabled={disabled}
            />
            <TextInput
                label={_("DNS server 1")}
                value={formData.dns1 || ""}
                error={formErrors.dns1 || null}
                helpText={HELP_TEXTS.static.dns}
                onChange={setFormValue((value) => ({
                    wan6_settings: { wan6_static: { dns1: { $set: value } } },
                }))}
                disabled={disabled}
            />
            <TextInput
                label={_("DNS server 2")}
                value={formData.dns2 || ""}
                error={formErrors.dns2 || null}
                helpText={HELP_TEXTS.static.dns}
                onChange={setFormValue((value) => ({
                    wan6_settings: { wan6_static: { dns2: { $set: value } } },
                }))}
                disabled={disabled}
            />
        </>
    );
}

_6to4Form.propTypes = {
    formData: PropTypes.shape({ ipv4_address: PropTypes.string }).isRequired,
    formErrors: PropTypes.shape({ ipv4_address: PropTypes.string }),
    setFormValue: PropTypes.func.isRequired,
};

_6to4Form.defaultProps = {
    formErrors: {},
};

function _6to4Form({ formData, formErrors, setFormValue, disabled }) {
    return (
        <TextInput
            label={_("Public IPv4")}
            value={formData.ipv4_address || ""}
            helpText={HELP_TEXTS["6to4"].ipv4_address}
            error={formErrors.ipv4_address || null}
            onChange={setFormValue((value) => ({
                wan6_settings: { wan6_6to4: { ipv4_address: { $set: value } } },
            }))}
            disabled={disabled}
        />
    );
}

const _6IN4_FIELDS_PROPS_TYPES = {
    server_ipv4: PropTypes.string,
    ipv6_prefix: PropTypes.string,
    mtu: PropTypes.string,
    dns1: PropTypes.string,
    dns2: PropTypes.string,
    dynamic_ipv4: PropTypes.shape({ enabled: PropTypes.bool }),
};

_6in4Form.propTypes = {
    formData: PropTypes.shape(_6IN4_FIELDS_PROPS_TYPES).isRequired,
    formErrors: PropTypes.shape(_6IN4_FIELDS_PROPS_TYPES),
};

_6in4Form.defaultProps = {
    formErrors: {},
};

function _6in4Form({ formData, formErrors, setFormValue, disabled }) {
    return (
        <>
            <TextInput
                label={_("Provider IPv4")}
                value={formData.server_ipv4 || ""}
                helpText={HELP_TEXTS["6in4"].server_ipv4}
                error={formErrors.server_ipv4 || null}
                required
                onChange={setFormValue((value) => ({
                    wan6_settings: {
                        wan6_6in4: { server_ipv4: { $set: value } },
                    },
                }))}
                disabled={disabled}
            />
            <TextInput
                label={_("Routed IPv6 prefix")}
                value={formData.ipv6_prefix || ""}
                helpText={HELP_TEXTS["6in4"].ipv6_prefix}
                error={formErrors.ipv6_prefix || null}
                onChange={setFormValue((value) => ({
                    wan6_settings: {
                        wan6_6in4: { ipv6_prefix: { $set: value } },
                    },
                }))}
                disabled={disabled}
            />
            <NumberInput
                label={_("MTU")}
                value={formData.mtu || ""}
                error={formErrors.mtu || null}
                min="1280"
                max="1480"
                required
                onChange={setFormValue((value) => ({
                    wan6_settings: { wan6_6in4: { mtu: { $set: value } } },
                }))}
                disabled={disabled}
            />
            <CheckBox
                label={_("Dynamic IPv4 handling")}
                checked={formData.dynamic_ipv4.enabled || false}
                helpText={HELP_TEXTS["6in4"].dynamic_ipv4.enabled}
                onChange={setFormValue((value) => ({
                    wan6_settings: {
                        wan6_6in4: {
                            dynamic_ipv4: { enabled: { $set: value } },
                        },
                    },
                }))}
                disabled={disabled}
            />
            {formData.dynamic_ipv4.enabled ? (
                <DynamicIPv4Form
                    formData={formData.dynamic_ipv4}
                    formErrors={formErrors.dynamic_ipv4}
                    setFormValue={setFormValue}
                    disabled={disabled}
                />
            ) : null}
        </>
    );
}

const _6IN4_DYNAMIC_IPv4_FIELDS_PROPS_TYPES = {
    tunnel_id: PropTypes.string,
    username: PropTypes.string,
    password_or_key: PropTypes.string,
};

DynamicIPv4Form.propTypes = {
    formData: PropTypes.shape(_6IN4_DYNAMIC_IPv4_FIELDS_PROPS_TYPES).isRequired,
    formErrors: PropTypes.shape(_6IN4_DYNAMIC_IPv4_FIELDS_PROPS_TYPES),
    setFormValue: PropTypes.func.isRequired,
};

DynamicIPv4Form.defaultProps = {
    formErrors: {},
};

function DynamicIPv4Form({ formData, formErrors, setFormValue, disabled }) {
    return (
        <>
            <TextInput
                label={_("Tunnel ID")}
                value={formData.tunnel_id || ""}
                helpText={HELP_TEXTS["6in4"].dynamic_ipv4.tunnel_id}
                error={formErrors.tunnel_id || null}
                required
                onChange={setFormValue((value) => ({
                    wan6_settings: {
                        wan6_6in4: {
                            dynamic_ipv4: { tunnel_id: { $set: value } },
                        },
                    },
                }))}
                disabled={disabled}
            />
            <TextInput
                label={_("Username")}
                value={formData.username || ""}
                helpText={HELP_TEXTS["6in4"].dynamic_ipv4.username}
                error={formErrors.username || null}
                required
                onChange={setFormValue((value) => ({
                    wan6_settings: {
                        wan6_6in4: {
                            dynamic_ipv4: { username: { $set: value } },
                        },
                    },
                }))}
                disabled={disabled}
            />
            <TextInput
                label={_("Key")}
                value={formData.password_or_key || ""}
                helpText={HELP_TEXTS["6in4"].dynamic_ipv4.password_or_key}
                error={formErrors.password_or_key || null}
                required
                onChange={setFormValue((value) => ({
                    wan6_settings: {
                        wan6_6in4: {
                            dynamic_ipv4: { password_or_key: { $set: value } },
                        },
                    },
                }))}
                disabled={disabled}
            />
        </>
    );
}

export function validateWAN6Form(formData) {
    const errors = {};
    switch (formData.wan6_type) {
        case "dhcpv6":
            errors.wan6_dhcpv6 = validateDHCPv6Form(formData.wan6_dhcpv6);
            break;
        case "static":
            errors.wan6_static = validateStaticForm(formData.wan6_static);
            break;
        case "6to4":
            errors.wan6_6to4 = validate6to4Form(formData.wan6_6to4);
            break;
        case "6in4":
            errors.wan6_6in4 = validate6in4Form(formData.wan6_6in4);
            break;
        default:
    }
    return errors[`wan6_${formData.wan6_type}`] ? errors : null;
}

function validateDHCPv6Form(wan6_dhcpv6) {
    const error = { duid: validateDUID(wan6_dhcpv6.duid) };
    return error.duid ? error : null;
}

function validateStaticForm(wan6_static) {
    const errors = {};
    ["ip", "network"].forEach((field) => {
        const error = validateIPv6Prefix(wan6_static[field]);
        if (error) errors[field] = error;
    });
    ["gateway", "dns1", "dns2"].forEach((field) => {
        const error = validateIPv6Address(wan6_static[field]);
        if (error) errors[field] = error;
    });
    ["ip", "network", "gateway"].forEach((field) => {
        if (!wan6_static[field] || wan6_static[field] === "")
            errors[field] = _("This field is required.");
    });

    return JSON.stringify(errors) !== "{}" ? errors : null;
}

function validate6to4Form(wan6_6to4) {
    const error = validateIPv4Address(wan6_6to4.ipv4_address);
    return error ? { ipv4_address: error } : null;
}

function validate6in4Form(wan6_6in4) {
    let errors = {
        server_ipv4: validateIPv4Address(wan6_6in4.server_ipv4),
        ipv6_prefix: validateIPv6Prefix(wan6_6in4.ipv6_prefix),
        dynamic_ipv4: validateDynamicIPv4Form(wan6_6in4.dynamic_ipv4),
    };

    if (!errors.server_ipv4 && !errors.ipv6_prefix && !errors.dynamic_ipv4)
        errors = {};

    const mtu = parseInt(wan6_6in4.mtu);
    if (Number.isNaN(mtu))
        errors.mtu = _("MTU has to be a number in the range of 1280-1480.");
    else if (!(mtu >= 1280 && mtu <= 1480))
        errors.mtu = _("MTU has to be in the range of 1280-1480.");

    ["mtu", "server_ipv4", "dynamic_ipv4"].forEach((field) => {
        if (!wan6_6in4[field] || wan6_6in4[field] === "")
            errors[field] = _("This field is required.");
    });

    return JSON.stringify(errors) !== "{}" ? errors : null;
}

function validateDynamicIPv4Form(dynamic_ipv4) {
    if (!dynamic_ipv4.enabled) return null;

    const errors = {};
    ["tunnel_id", "username", "password_or_key"].forEach((field) => {
        if (!dynamic_ipv4[field] || dynamic_ipv4[field] === "")
            errors[field] = _("This field is required.");
    });
    return JSON.stringify(errors) !== "{}" ? errors : null;
}
