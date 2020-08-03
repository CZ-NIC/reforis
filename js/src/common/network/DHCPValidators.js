/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import { undefinedIfEmpty, withoutUndefinedKeys } from "foris";

import { validateRequiredField } from "./validators";

function validatePositiveNumber(number) {
    // eslint-disable-next-line no-restricted-globals
    if (number === "" || isNaN(number)) {
        return _("Value must be a number.");
    }
    if (number < 1) {
        return _("Value must be positive.");
    }
    return undefined;
}

export default function validateDHCP(dhcpSettings) {
    const errors = {
        start: validateRequiredField(dhcpSettings.start),
        limit: validatePositiveNumber(dhcpSettings.limit),
        lease_time:
            dhcpSettings.lease_time < 1
                ? _("Minimum lease time is 1 hour.")
                : undefined,
    };

    return undefinedIfEmpty(withoutUndefinedKeys(errors));
}
