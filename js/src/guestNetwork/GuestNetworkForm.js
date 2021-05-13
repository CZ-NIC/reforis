/*
 * Copyright (C) 2020-2021 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import { Switch, TextInput } from "foris";

import DHCPServerForm, {
    HELP_TEXT as DHCP_HELP_TEXT,
} from "common/network/DHCPServerForm";

import QoSForm from "../common/network/QoSForm";

const HELP_TEXTS = {
    router_ip: _("Router's IP address in the guest inner network."),
    netmask: _("Network mask of the guest inner network."),
    dhcp: DHCP_HELP_TEXT,
    qos: {
        enabled: _(`This option enables you to set a bandwidth limit for the \
guest network, so that your main network doesn't get slowed-down by it.`),
        download: _(
            "Download speed in guest network (in kilobits per second)."
        ),
        upload: _("Upload speed in guest network (in kilobits per second)."),
    },
};

GuestNetworkForm.propTypes = {
    formData: PropTypes.shape({
        enabled: PropTypes.bool.isRequired,
        ip: PropTypes.string,
        netmask: PropTypes.string,
        dhcp: PropTypes.object,
        qos: PropTypes.object,
    }),
    formErrors: PropTypes.shape({
        ip: PropTypes.string,
        netmask: PropTypes.string,
        dhcp: PropTypes.object,
        qos: PropTypes.object,
    }),
    setFormValue: PropTypes.func,
    disabled: PropTypes.bool,
};

GuestNetworkForm.defaultProps = {
    formData: {
        enabled: false,
    },
    formErrors: {},
};

export default function GuestNetworkForm({
    formData,
    formErrors,
    setFormValue,
    disabled,
}) {
    return (
        <>
            <h2>{_("Guest Network Settings")}</h2>
            <Switch
                label={_("Enable Guest Network")}
                checked={formData.enabled}
                onChange={setFormValue((value) => ({
                    enabled: { $set: value },
                }))}
                disabled={disabled}
            />
            {formData.enabled ? (
                <>
                    <TextInput
                        label={_("Router IP address")}
                        value={formData.ip || ""}
                        error={formErrors.ip || null}
                        helpText={HELP_TEXTS.router_ip}
                        required
                        onChange={setFormValue((value) => ({
                            ip: { $set: value },
                        }))}
                        disabled={disabled}
                    />
                    <TextInput
                        label={_("Network mask")}
                        value={formData.netmask || ""}
                        error={formErrors.netmask || null}
                        required
                        onChange={setFormValue((value) => ({
                            netmask: { $set: value },
                        }))}
                        disabled={disabled}
                    />
                    <Switch
                        label={_("Enable DHCP")}
                        checked={formData.dhcp.enabled}
                        helpText={HELP_TEXTS.dhcp}
                        onChange={setFormValue((value) => ({
                            dhcp: { enabled: { $set: value } },
                        }))}
                        disabled={disabled}
                    />
                    {formData.dhcp.enabled ? (
                        <DHCPServerForm
                            formData={formData.dhcp}
                            formErrors={formErrors.dhcp ? formErrors.dhcp : {}}
                            updateRule={(value) => ({ dhcp: value })}
                            setFormValue={setFormValue}
                            disabled={disabled}
                        />
                    ) : null}
                    <QoSForm
                        formData={formData.qos}
                        formErrors={formErrors.qos}
                        setFormValue={setFormValue}
                        disabled={disabled}
                        helpTexts={HELP_TEXTS.qos}
                    />
                </>
            ) : null}
        </>
    );
}
