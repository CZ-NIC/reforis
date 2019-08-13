/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import propTypes from 'prop-types';

import CheckBox from 'common/bootstrap/Checkbox';
import {formFieldsSize} from 'common/bootstrap/constants';

LanguageForm.propTypes = {
    formData: propTypes.shape({
        languages: propTypes.arrayOf(propTypes.shape({
            code: propTypes.string.isRequired,
            enabled: propTypes.bool.isRequired,
        })).isRequired,
    }),
    setFormValue: propTypes.func,
};

export default function LanguageForm({formData, formErrors, setFormValue, ...props}) {
    return <>
        <h3>{_('Languages')}</h3>
        <p>{_('If you want to use other language than English you can select it from the following list:')}</p>
        <div id="language-packages" className={formFieldsSize}>
        {formData.languages.map((language, idx) => {
            return <CheckBox
                label={language.code.toUpperCase()}
                key={idx}
                checked={language.enabled}
                useDefaultSize={false}

                onChange={setFormValue(value => ({
                    languages: {[idx]: {enabled: {$set: value}}}
                }))}

                {...props}
            />
        })}
        </div>
    </>
}
