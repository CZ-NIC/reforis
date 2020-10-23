/*
 * Copyright (C) 2021 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";
import { TextInput } from "foris";

const HELP_TEXT = {
    device_hostname: _("Rewrite the hostname to set a new one."),
};

HostnameForm.defaultProps = {
    formErrors: {},
};

HostnameForm.propTypes = {
    formData: PropTypes.shape({
        hostname: PropTypes.string.isRequired,
    }),
    formErrors: PropTypes.shape({
        hostname: PropTypes.string,
    }),
    setFormValue: PropTypes.func,
};

export default function HostnameForm({ formData, setFormValue, formErrors }) {
    return (
        <>
            <h2>{_("Hostname Settings")}</h2>
            <TextInput
                label={_("Device hostname")}
                value={formData.hostname}
                error={formErrors.hostname}
                helpText={HELP_TEXT.device_hostname}
                onChange={setFormValue((value) => ({
                    hostname: { $set: value },
                }))}
            />
        </>
    );
}
