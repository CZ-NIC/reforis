/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import { Select } from "foris";
import LANManagedForm from "./LANManagedForm";
import LANUnmanagedForm from "./LANUnmanagedForm";

const HELP_TEXTS = {
    mode: _(`
Router mode means that this device manages the LAN (acts as a router, can assign IP addresses, ...).
Computer mode means that this device acts as a client in this network. It acts in a similar way as WAN, but
it has opened ports for configuration interface and other services.
        `),
};

export const LAN_MODES = {
    managed: "managed",
    unmanaged: "unmanaged",
};

const LAN_MOD_CHOICES = {
    managed: _("Router"),
    unmanaged: _("Computer"),
};

LANForm.propTypes = {
    formData: PropTypes.shape({
        mode: PropTypes.string.isRequired,
        mode_managed: PropTypes.object,
        mode_unmanaged: PropTypes.object,
    }),
    formErrors: PropTypes.shape({
        mode_managed: PropTypes.object,
        mode_unmanaged: PropTypes.object,
    }),
    setFormValue: PropTypes.func,
    disabled: PropTypes.bool,
};

export default function LANForm({
    formData,
    formErrors,
    setFormValue,
    disabled,
}) {
    const errors = formErrors || {};
    const lanMode = formData.mode;

    let lanForm = null;
    if (lanMode === LAN_MODES.managed) {
        lanForm = (
            <LANManagedForm
                formData={formData.mode_managed}
                formErrors={errors.mode_managed}
                setFormValue={setFormValue}
                disabled={disabled}
            />
        );
    } else if (lanMode === LAN_MODES.unmanaged) {
        lanForm = (
            <LANUnmanagedForm
                formData={formData.mode_unmanaged}
                formErrors={errors.mode_unmanaged}
                setFormValue={setFormValue}
                disabled={disabled}
            />
        );
    }

    return (
        <>
            <h2>{_("LAN Settings")}</h2>
            <Select
                label={_("LAN mode")}
                value={formData.mode}
                choices={LAN_MOD_CHOICES}
                helpText={HELP_TEXTS.mode}
                onChange={setFormValue((value) => ({ mode: { $set: value } }))}
                disabled={disabled}
            />
            {lanForm}
        </>
    );
}
