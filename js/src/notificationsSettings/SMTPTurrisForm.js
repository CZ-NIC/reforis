/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import TextInput from "common/bootstrap/TextInput";

import HELP_TEXTS from "./helpTexts";

SMTPTurrisForm.propTypes = {
    formData: PropTypes.shape({ sender_name: PropTypes.string }).isRequired,
    formErrors: PropTypes.shape({ sender_name: PropTypes.string }),
    setFormValue: PropTypes.func.isRequired,
};

SMTPTurrisForm.defaultProps = {
    setFormValue: () => {
    },
    formData: {},
    formErrors: {},
};


export default function SMTPTurrisForm({
    formData, formErrors, setFormValue, ...props
}) {
    return (
        <>
            <TextInput
                label={_("Sender's name")}
                value={formData.sender_name || ""}
                error={formErrors.sender_name}
                helpText={HELP_TEXTS.smtp_turris.sender_name}

                onChange={setFormValue(
                    (value) => ({ smtp_turris: { sender_name: { $set: value } } }),
                )}

                {...props}
            />
        </>
    );
}
