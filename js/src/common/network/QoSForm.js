/*
 * Copyright (C) 2021 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";
import { NumberInput, Switch, undefinedIfEmpty } from "foris";

QoSForm.propTypes = {
    formData: PropTypes.shape({
        enabled: PropTypes.bool,
        download: PropTypes.string,
        upload: PropTypes.string,
    }).isRequired,
    setFormValue: PropTypes.func.isRequired,
    formErrors: PropTypes.shape({
        download: PropTypes.string,
        upload: PropTypes.string,
    }),
    helpTexts: PropTypes.shape({
        download: PropTypes.string,
        upload: PropTypes.string,
        enabled: PropTypes.string,
    }),
    disabled: PropTypes.bool,
};

QoSForm.defaultProps = {
    formErrors: {},
};

export default function QoSForm({
    formData,
    formErrors,
    setFormValue,
    disabled,
    helpTexts,
}) {
    return (
        <>
            <Switch
                label={_("Enable QoS")}
                checked={formData.enabled}
                helpText={helpTexts.enabled}
                onChange={setFormValue((value) => ({
                    qos: { enabled: { $set: value } },
                }))}
                disabled={disabled}
            />
            {formData.enabled && (
                <>
                    <NumberInput
                        label={_("Download")}
                        value={formData.download}
                        error={formErrors.download}
                        helpText={helpTexts.download}
                        inlineText="kb/s"
                        min="1"
                        required
                        onChange={setFormValue((value) => ({
                            qos: { download: { $set: value } },
                        }))}
                        disabled={disabled}
                    />
                    <NumberInput
                        label={_("Upload")}
                        value={formData.upload}
                        error={formErrors.upload}
                        helpText={helpTexts.upload}
                        inlineText="kb/s"
                        min="1"
                        required
                        onChange={setFormValue((value) => ({
                            qos: { upload: { $set: value } },
                        }))}
                        disabled={disabled}
                    />
                </>
            )}
        </>
    );
}

export function validateQoS(formData) {
    const errors = {};
    if (formData.download < 1) {
        errors.download = _("Download speed must be positive.");
    }
    if (formData.upload < 1) {
        errors.upload = _("Upload speed must be positive.");
    }
    return undefinedIfEmpty(errors);
}
