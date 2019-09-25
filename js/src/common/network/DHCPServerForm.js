/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import { NumberInput, undefinedIfEmpty } from "foris";

export const HELP_TEXT = _("Enable this option to automatically assign IP addresses to the devices connected to the router.");

DHCPServerForm.propTypes = {
    formData: PropTypes.shape({
        start: PropTypes.number,
        limit: PropTypes.number,
        lease_time: PropTypes.number,
    }).isRequired,
    formErrors: PropTypes.shape({
        start: PropTypes.string,
        limit: PropTypes.string,
        lease_time: PropTypes.string,
    }),
    setFormValue: PropTypes.func.isRequired,
    updateRule: PropTypes.func.isRequired,
};

DHCPServerForm.defaultProps = {
    formErrors: {},
};

export default function DHCPServerForm({
    formData, formErrors, updateRule, setFormValue, ...props
}) {
    return (
        <>
            <NumberInput
                label={_("DHCP start")}
                value={formData.start}
                error={formErrors.start}
                min="1"
                required

                onChange={setFormValue(
                    (value) => updateRule({ start: { $set: value } }),
                )}

                {...props}
            />
            <NumberInput
                label={_("DHCP max leases")}
                value={formData.limit}
                error={formErrors.limit}
                min="1"
                required

                onChange={setFormValue(
                    (value) => updateRule({ limit: { $set: value } }),
                )}

                {...props}
            />
            <NumberInput
                label={_("Lease time (hours)")}
                value={formData.lease_time}
                error={formErrors.lease_time}
                min="1"
                required

                onChange={setFormValue(
                    (value) => updateRule({ lease_time: { $set: value } }),
                )}

                {...props}
            />
        </>
    );
}

export function validateDHCP(formData) {
    const errors = {};
    if (formData.start < 1) {
        errors.start = _("DHCP start must be positive");
    }
    if (formData.limit < 1) {
        errors.limit = _("At least 1 lease is required");
    }
    if (formData.lease_time < 1) {
        errors.lease_time = _("Minimum lease time is 1 hour");
    }
    return undefinedIfEmpty(errors);
}
