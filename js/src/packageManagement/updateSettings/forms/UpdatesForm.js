/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { Switch, undefinedIfEmpty, withoutUndefinedKeys } from "foris";
import PropTypes from "prop-types";
import RestartAfterUpdateForm, {
    validateRestartAfterUpdate,
} from "./RestartAfterUpdateForm";
import UpdateApprovalForm, {
    validateUpdateApproval,
} from "./UpdateApprovalForm";

UpdatesForm.defaultProps = {
    formErrors: {},
    setFormValue: () => {},
};

UpdatesForm.propTypes = {
    formData: PropTypes.shape({
        enabled: PropTypes.bool,
        approval_settings: PropTypes.object,
        reboots: PropTypes.object,
    }),
    formErrors: PropTypes.shape({
        approval_settings: PropTypes.object,
        reboots: PropTypes.object,
    }),
    setFormValue: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

export default function UpdatesForm({
    formData,
    formErrors,
    setFormValue,
    disabled,
}) {
    return (
        <>
            <h2>{_("Automatic Update Settings")}</h2>
            <Switch
                label={_("Enable automatic updates (recommended)")}
                checked={formData.enabled || false}
                onChange={setFormValue((value) => ({
                    enabled: { $set: value },
                }))}
                disabled={disabled}
            />
            {formData.enabled ? (
                <UpdateApprovalForm
                    formData={formData.approval_settings}
                    formErrors={formErrors.approval_settings}
                    setFormValue={setFormValue}
                    disabled={disabled}
                />
            ) : null}
            <RestartAfterUpdateForm
                formData={formData.reboots}
                formErrors={formErrors.reboots}
                setFormValue={setFormValue}
                disabled={disabled}
            />
        </>
    );
}

export function validateUpdates(formData) {
    const errors = {
        reboots: validateRestartAfterUpdate(formData.reboots),
    };
    if (formData.enabled) {
        errors.approval_settings = validateUpdateApproval(
            formData.approval_settings
        );
    }
    return undefinedIfEmpty(withoutUndefinedKeys(errors));
}
