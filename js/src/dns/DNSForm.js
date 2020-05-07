/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useState } from "react";
import PropTypes from "prop-types";

import { CheckBox, TextInput, WebSockets } from "foris";

import DNSSECDisableModal from "./DNSSECDisableModal";
import Forwarders from "./Forwarders/Forwarders";

const HELP_TEXTS = {
    dns_from_dhcp_enabled: _("This will enable your DNS resolver to place DHCP client's names among the local DNS records."),
    dns_from_dhcp_domain: _("This domain will be used as suffix. E.g. The result for client \"android-123\" and domain \"my.lan\" will be \"android-123.my.lan\"."),
};

DNSForm.defaultProps = {
    formErrors: {},
};

DNSForm.propTypes = {
    formData: PropTypes.shape({
        forwarding_enabled: PropTypes.bool.isRequired,
        available_forwarders: PropTypes.array.isRequired,
        forwarder: PropTypes.string,
        dnssec_enabled: PropTypes.bool.isRequired,
        dns_from_dhcp_enabled: PropTypes.bool.isRequired,
        dns_from_dhcp_domain: PropTypes.string,

    }),
    formErrors: PropTypes.shape({
        dns_from_dhcp_domain: PropTypes.string,
    }),
    setFormValue: PropTypes.func,
    ws: PropTypes.instanceOf(WebSockets),
    disabled: PropTypes.bool,
};

export default function DNSForm({
    formData, formErrors, setFormValue, ws, disabled,
}) {
    const [DNSSECModalShown, setDNSSECModalShown] = useState(false);

    function changeDNSSECHandler(event) {
        if (event.target.checked) {
            setFormValue((value) => ({ dnssec_enabled: { $set: value } }))(event);
        } else {
            setDNSSECModalShown(true);
        }
    }

    return (
        <>
            <DNSSECDisableModal
                shown={DNSSECModalShown}
                setShown={setDNSSECModalShown}
                callback={() => {
                    setFormValue((value) => ({ dnssec_enabled: { $set: value } }))({
                        target: {
                            name: "dnssec_enabled",
                            value: false,
                        },
                    });
                    setDNSSECModalShown(false);
                }}
            />
            <CheckBox
                label={_("Use forwarding")}
                checked={formData.forwarding_enabled}

                onChange={setFormValue((value) => ({ forwarding_enabled: { $set: value } }))}

                disabled={disabled}
            />
            {formData.forwarding_enabled && (
                <Forwarders
                    value={formData.forwarder}
                    setFormValue={setFormValue}
                    ws={ws}
                    disabled={disabled}
                />
            )}
            <CheckBox
                label={_("Enable DNSSEC")}
                checked={formData.dnssec_enabled}

                onChange={changeDNSSECHandler}

                disabled={disabled}
            />
            <CheckBox
                label={_("Enable DHCP clients in DNS")}
                checked={formData.dns_from_dhcp_enabled}
                helpText={HELP_TEXTS.dns_from_dhcp_enabled}

                onChange={setFormValue((value) => ({ dns_from_dhcp_enabled: { $set: value } }))}

                disabled={disabled}
            />
            {formData.dns_from_dhcp_enabled
                    && (
                        <TextInput
                            label={_("Domain of DHCP clients in DNS")}
                            value={formData.dns_from_dhcp_domain}
                            helpText={HELP_TEXTS.dns_from_dhcp_domain}
                            error={formErrors.dns_from_dhcp_domain}

                            onChange={setFormValue(
                                (value) => ({ dns_from_dhcp_domain: { $set: value } }),
                            )}

                            disabled={disabled}
                        />
                    )}
        </>
    );
}
