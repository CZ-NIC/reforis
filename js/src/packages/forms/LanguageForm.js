/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';

import CheckBox from '../../bootstrap/Checkbox';

export default function LanguageForm({formData, setFormValue, ...props}) {
    return <>
        <h3>{_('Languages')}</h3>
        <p>{_('If you want to use other language than English you can select it from the following list:')}</p>
        {formData.map((language, idx) =>{
            return <CheckBox
                label={language.code.toUpperCase()}
                key={idx}
                checked={language.enabled}

                onChange={setFormValue(value => ({
                    languages: {[idx]: {enabled: {$set: value}}}
                }))}

                {...props}
            />
        })}
    </>
}
