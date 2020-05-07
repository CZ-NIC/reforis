/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import { NumberInput, TextInput } from "foris";

export const HELP_TEXT = _("Enable this option to automatically assign IP addresses to the devices connected to the router.");

DHCPServerForm.propTypes = {
    formData: PropTypes.shape({
        start: PropTypes.string,
        limit: PropTypes.number,
        lease_time: PropTypes.number,
    }).isRequired,
    formErrors: PropTypes.shape({
        start: PropTypes.string,
        limit: PropTypes.string,
        lease_time: PropTypes.string,
    }),
    updateRule: PropTypes.func.isRequired,
    setFormValue: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

DHCPServerForm.defaultProps = {
    formErrors: {},
};

export default function DHCPServerForm({
    formData, formErrors, updateRule, setFormValue, disabled,
}) {
    return (
        <>
            <TextInput
                label={_("DHCP start")}
                value={formData.start}
                error={formErrors.start}
                required

                onChange={setFormValue(
                    (value) => updateRule({ start: { $set: value } }),
                )}

                disabled={disabled}
            />
            <NumberInput
                label={_("DHCP max leases")}
                helpText={_("Maximum number of addresses available for DHCP clients.")}
                value={formData.limit}
                error={formErrors.limit}
                min="1"
                required

                onChange={setFormValue(
                    (value) => updateRule({ limit: { $set: value } }),
                )}

                disabled={disabled}
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

                disabled={disabled}
            />
        </>
    );
}
