/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import { NumberInput } from "foris";

export const HELP_TEXT = _("Enable this option to automatically assign IP addresses to the devices connected to the router.");

DHCPServerForm.propTypes = {
    formData: PropTypes.shape({
        start: PropTypes.number,
        limit: PropTypes.number,
        lease_time: PropTypes.number,
    }).isRequired,
    setFormValue: PropTypes.func.isRequired,
    updateRule: PropTypes.func.isRequired,
};

export default function DHCPServerForm({
    formData, updateRule, setFormValue, ...props
}) {
    return (
        <>
            <NumberInput
                label={_("DHCP start")}
                value={formData.start}
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
                min="120"
                required

                onChange={setFormValue(
                    (value) => updateRule({ lease_time: { $set: value } }),
                )}

                {...props}
            />
        </>
    );
}
