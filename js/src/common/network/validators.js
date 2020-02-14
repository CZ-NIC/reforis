/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import ipaddr from "ipaddr";

export function validateNetworkMask(networkMask) {
    if (ipaddr.IPv4.parse(networkMask).prefixLengthFromSubnetMask() === null) {
        return _("This is not a valid network mask.");
    }
    return undefined;
}

export function validateRequiredField(value) {
    if ([null, undefined, ""].includes(value)) {
        return _("This field is required.");
    }
    return undefined;
}
