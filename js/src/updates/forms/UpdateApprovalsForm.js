/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import RadioSet from "common/bootstrap/RadioSet";
import NumberInput from "common/bootstrap/NumberInput";

const UPDATE_APPROVALS_CHOICES = [
    {
        value: "off",
        label: _("Automatic installation"),
        helpText: _("Updates will be installed without user's intervention."),
    },
    {
        value: "delayed",
        label: _("Delayed updates"),
        helpText: _("Updates will be installed with an adjustable delay. You can also approve them manually."),
    },
    {
        value: "on",
        label: _("Update approval needed"),
        helpText: _("You have to approve the updates, otherwise they won't be installed."),
    },
];

UpdateApprovalsForm.propTypes = {
    setFormValue: PropTypes.func.isRequired,
    formData: PropTypes.shape({
        status: PropTypes.string,
        delay: PropTypes.number,
    }),
};

export default function UpdateApprovalsForm({ formData, setFormValue, ...props }) {
    return (
        <>
            <h4>{_("Update approvals")}</h4>
            <p>
                {_(
                    `Update approvals can be useful when you want to make sure that updates won't harm your specific
            configuration. You can e.g. install updates when you're prepared for a possible rollback to a previous
            snapshot and deny the questionable update temporarily. It isn't possible to decline the update forever an
            it will be offered to you again together with the next package installation.`,
                )}
            </p>
            <RadioSet
                value={formData.status}
                name="approvals"
                choices={UPDATE_APPROVALS_CHOICES}

                onChange={
                    setFormValue((value) => ({ approval_settings: { status: { $set: value } } }))
                }

                {...props}
            />
            {formData.status === "delayed" ? (
                <NumberInput
                    label={_("Delayed updates (hours)")}
                    value={formData.delay}
                    min="1"
                    max="168"

                    onChange={
                        setFormValue((value) => ({ approval_settings: { delay: { $set: value } } }))
                    }

                    {...props}
                />
            ) : null}
        </>
    );
}
