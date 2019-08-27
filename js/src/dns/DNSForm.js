/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useState } from "react";
import PropTypes from "prop-types";

import { CheckBox } from "foris";
import { Select } from "foris";
import { TextInput } from "foris";
import DNSSECDisableModal from "./DNSSECDisableModal";

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
};

export default function DNSForm({
    formData, formErrors, setFormValue, ...props
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

                {...props}
            />
            {formData.forwarding_enabled
                ? (
                    <Select
                        label={_("DNS Forwarder")}
                        value={formData.forwarder}
                        choices={getForwardersChoices(formData.available_forwarders)}
                        onChange={setFormValue((value) => ({ forwarder: { $set: value } }))}

                        {...props}
                    />
                )
                : null}
            <CheckBox
                label={_("Enable DNSSEC")}
                checked={formData.dnssec_enabled}

                onChange={changeDNSSECHandler}

                {...props}
            />
            <CheckBox
                label={_("Enable DHCP clients in DNS")}
                checked={formData.dns_from_dhcp_enabled}
                helpText={HELP_TEXTS.dns_from_dhcp_enabled}

                onChange={setFormValue((value) => ({ dns_from_dhcp_enabled: { $set: value } }))}

                {...props}
            />
            {formData.dns_from_dhcp_enabled
                ? (
                    <TextInput
                        label={_("Domain of DHCP clients in DNS")}
                        value={formData.dns_from_dhcp_domain}
                        helpText={HELP_TEXTS.dns_from_dhcp_domain}
                        error={formErrors.dns_from_dhcp_domain}

                        onChange={setFormValue(
                            (value) => ({ dns_from_dhcp_domain: { $set: value } }),
                        )}

                        {...props}
                    />
                )
                : null}
        </>
    );
}

function getForwardersChoices(available_forwarders) {
    return available_forwarders.reduce(
        (choices, forwarder) => {
            choices[forwarder.name] = forwarder.name === "" ? _("Use provider's DNS resolver") : forwarder.description;
            return choices;
        }, {},
    );
}
