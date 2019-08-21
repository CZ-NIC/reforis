/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import CheckBox from "common/bootstrap/Checkbox";
import { formFieldsSize } from "common/bootstrap/constants";

LanguageForm.propTypes = {
    formData: PropTypes.shape({
        languages: PropTypes.arrayOf(PropTypes.shape({
            code: PropTypes.string.isRequired,
            enabled: PropTypes.bool.isRequired,
        })).isRequired,
    }),
    setFormValue: PropTypes.func,
    disabled: PropTypes.bool,
};

export default function LanguageForm({ formData, setFormValue, disabled }) {
    return (
        <>
            <h3>{_("Languages")}</h3>
            <p>{_("If you want to use other language than English you can select it from the following list:")}</p>
            <div id="language-packages" className={formFieldsSize}>
                {formData.languages.map((language, idx) => (
                    <CheckBox
                        label={language.code.toUpperCase()}
                        key={idx}
                        checked={language.enabled}
                        useDefaultSize={false}
                        disabled={disabled}

                        onChange={setFormValue((value) => ({
                            languages: { [idx]: { enabled: { $set: value } } },
                        }))}
                    />
                ))}
            </div>
        </>
    );
}
