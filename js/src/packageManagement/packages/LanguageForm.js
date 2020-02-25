/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import { CheckBox } from "foris";

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
            <p>{_("If you want to use another language than English you can select it from the following list:")}</p>
            <div className="container mb-3">
                <div className="row justify-content-start">
                    {formData.languages.map((language, idx) => (
                        <div className="col-2 col-lg-1 mr-4" key={language.code}>
                            <CheckBox
                                label={language.code.toUpperCase()}
                                checked={language.enabled}
                                disabled={disabled}

                                onChange={setFormValue((value) => ({
                                    languages: { [idx]: { enabled: { $set: value } } },
                                }))}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
