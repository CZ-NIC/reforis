/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";
import { Select, TextInput } from "foris";

import forwarderPropTypes from "./propTypes";

const TLS_TYPES = {
    no: "No TLS",
    hostname: "Hostname",
    pin: "Pin",
};

const HELP_TEXTS = {
    tls_pin: _("base64 encoded sha256."),
};

ForwarderForm.propTypes = {
    formData: forwarderPropTypes,
    formErrors: PropTypes.shape({
        ipaddresses: PropTypes.shape({
            ipv4: PropTypes.string,
            ipv6: PropTypes.string,
        }),
        tls_hostname: PropTypes.string,
    }),
    setFormValue: PropTypes.func,
};

export default function ForwarderForm({
    formData, formErrors, setFormValue, ...props
}) {
    const errors = formErrors || {};
    return (
        <>
            <TextInput
                label={_("Name")}
                value={formData.name}
                error={errors.name}
                required

                onChange={setFormValue(
                    (value) => ({ name: { $set: value } }),
                )}
                {...props}
            />
            <TextInput
                label={_("Description")}
                value={formData.description}

                onChange={setFormValue(
                    (value) => ({ description: { $set: value } }),
                )}
                {...props}
            />
            <TextInput
                label={_("IPv4")}
                value={formData.ipaddresses.ipv4}
                error={(errors.ipaddresses || {}).ipv4}

                onChange={setFormValue(
                    (value) => ({ ipaddresses: { ipv4: { $set: value } } }),
                )}
                {...props}
            />
            <TextInput
                label={_("IPv6")}
                value={formData.ipaddresses.ipv6}

                error={(errors.ipaddresses || {}).ipv6}
                onChange={setFormValue(
                    (value) => ({ ipaddresses: { ipv6: { $set: value } } }),
                )}
                {...props}
            />
            <Select
                label={_("TLS type")}
                value={formData.tls_type}
                choices={TLS_TYPES}

                onChange={setFormValue(
                    (value) => {
                        const fieldsToAdd = {
                            hostname: "tls_hostname",
                            pin: "tls_pin",
                        };
                        return {
                            tls_type: { $set: value },
                            [fieldsToAdd[value]]: { $set: "" },
                        };
                    },
                )}

                {...props}
            />
            {formData.tls_type === "hostname"
                ? (
                    <TextInput
                        label={_("TLS hostname")}
                        value={formData.tls_hostname || ""}
                        error={errors.tls_hostname}

                        onChange={setFormValue(
                            (value) => ({ tls_hostname: { $set: value } }),
                        )}
                        {...props}
                    />
                )
                : null}

            {formData.tls_type === "pin"
                ? (
                    <TextInput
                        label={_("TLS pin")}
                        value={formData.tls_pin || ""}
                        error={errors.tls_pin}
                        helpText={HELP_TEXTS.tls_pin}

                        onChange={setFormValue(
                            (value) => ({ tls_pin: { $set: value } }),
                        )}
                        {...props}
                    />
                )
                : null}
        </>
    );
}
