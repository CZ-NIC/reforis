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
    const errors = {
        description: formData.description.length < 1 ? _("Forwarder name should have at least one symbol.") : undefined,
        ipaddresses: validateIPAddresses(formData.ipaddresses),
    };

    if (formData.tls_type === "hostname") {
        errors.tls_hostname = formData.tls_hostname.length < 1
            ? _("Hostname should have at least one symbol.")
            : validateDomain(formData.tls_hostname);
    } else if (formData.tls_type === "pin") {
        errors.tls_pin = formData.tls_pin.length < 1
            ? _("TLS pin should have at least one symbol.") : undefined;
    }

    return undefinedIfEmpty(withoutUndefinedKeys(errors));
}

function validateIPAddresses(ipaddresses) {
    if (ipaddresses.ipv4.filter((ipaddress) => ipaddress.length).length === 0
        && ipaddresses.ipv6.filter((ipaddress) => ipaddress.length).length === 0) {
        const message = _("Define at least one of the IP addresses of the forwarder.");
        return {
            ipv4: [message],
            ipv6: [message],
        };
    }

    const errors = {
        ipv4: ipaddresses.ipv4
            .map((ipaddress) => validateIPv4Address(ipaddress)),
        ipv6: ipaddresses.ipv6
            .map((ipaddress) => validateIPv6Address(ipaddress)),
    };

    if (errors.ipv4.filter((ipaddress) => !!ipaddress).length === 0) {
        delete errors.ipv4;
    }
    if (errors.ipv6.filter((ipaddress) => !!ipaddress).length === 0) {
        delete errors.ipv6;
    }

    return undefinedIfEmpty(withoutUndefinedKeys(errors));
}
