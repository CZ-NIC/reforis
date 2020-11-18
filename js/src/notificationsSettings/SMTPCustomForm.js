/*
 * Copyright (C) 2019-2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import {
    Select,
    TextInput,
    NumberInput,
    PasswordInput,
    EmailInput,
} from "foris";

import HELP_TEXTS from "./helpTexts";

const SECURITY_CHOICES = {
    none: _("None"),
    ssl: _("SSL"),
    starttls: _("STARTTLS"),
};

SMTPCustomForm.propTypes = {
    formData: PropTypes.shape({
        from: PropTypes.string,
        host: PropTypes.string,
        port: PropTypes.number,
        security: PropTypes.oneOf(["none", "ssl", "starttls"]),
        username: PropTypes.string,
        password: PropTypes.string,
    }).isRequired,
    formErrors: PropTypes.shape({
        from: PropTypes.string,
        host: PropTypes.string,
        port: PropTypes.string,
        username: PropTypes.string,
        password: PropTypes.string,
    }),
    setFormValue: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

SMTPCustomForm.defaultProps = {
    setFormValue: () => {},
    formData: {},
    formErrors: {},
};

export default function SMTPCustomForm({
    formData,
    formErrors,
    setFormValue,
    disabled,
}) {
    return (
        <>
            <h3>{_("SMTP Settings")}</h3>
            <EmailInput
                label={_("Sender address (From)")}
                value={formData.from || ""}
                error={formErrors.from}
                helpText={HELP_TEXTS.smtp_custom.from}
                placeholder="router@example.com"
                required
                onChange={setFormValue((value) => ({
                    smtp_custom: { from: { $set: value } },
                }))}
                disabled={disabled}
            />
            <TextInput
                label={_("Server address")}
                value={formData.host || ""}
                error={formErrors.host}
                placeholder="example.com"
                required
                onChange={setFormValue((value) => ({
                    smtp_custom: { host: { $set: value } },
                }))}
                disabled={disabled}
            />
            <NumberInput
                label={_("Server port")}
                value={formData.port}
                error={formErrors.port}
                min={1}
                max={65535}
                onChange={setFormValue((value) => ({
                    smtp_custom: { port: { $set: value } },
                }))}
                disabled={disabled}
            />
            <Select
                label={_("Security")}
                value={formData.security}
                choices={SECURITY_CHOICES}
                onChange={setFormValue((value) => ({
                    smtp_custom: { security: { $set: value } },
                }))}
                disabled={disabled}
            />
            <TextInput
                label={_("Username")}
                value={formData.username || ""}
                onChange={setFormValue((value) => ({
                    smtp_custom: { username: { $set: value } },
                }))}
                disabled={disabled}
            />
            <PasswordInput
                label={_("Password")}
                withEye
                value={formData.password || ""}
                onChange={setFormValue((value) => ({
                    smtp_custom: { password: { $set: value } },
                }))}
                disabled={disabled}
            />
        </>
    );
}
