/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import {
    undefinedIfEmpty,
    validateDomain,
    validateIPv4Address,
    validateIPv6Address,
    withoutUndefinedKeys,
} from "foris";

export default function validator(formData) {
    function checkAtLeastOneIP() {
        if (!formData.ipaddresses.ipv4 && !formData.ipaddresses.ipv6) {
            return _("Define at least one of the IP addresses of the forwarder.");
        }
    }

    const errors = {
        description: formData.description.length < 1 ? _("Forwarder name should have at least one symbol.") : undefined,
        ipaddresses: {
            ipv4: validateIPv4Address(formData.ipaddresses.ipv4) || checkAtLeastOneIP(),
            ipv6: validateIPv6Address(formData.ipaddresses.ipv6) || checkAtLeastOneIP(),
        },
    };

    if (formData.tls_type === "hostname") {
        errors.tls_hostname = formData.tls_hostname.length < 1
            ? _("Hostname should have at least one symbol.")
            : validateDomain(formData.tls_hostname);
    } else if (formData.tls_type === "pin") {
        errors.tls_pin = formData.tls_pin.length < 1
            ? _("TLS pin should have at least one symbol.") : undefined;
    }

    errors.ipaddresses = undefinedIfEmpty(withoutUndefinedKeys(errors.ipaddresses));
    return undefinedIfEmpty(withoutUndefinedKeys(errors));
}
