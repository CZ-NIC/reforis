/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';

import CheckBox from '../../bootstrap/Checkbox';

export default function PackagesForm({formData, setFormValue, ...props}) {
    return <>
        <h3>{_('Packages')}</h3>
        {formData.map((_package, idx) => <CheckBox
            label={_package.title}
            key={idx}
            helpText={_package.msg}
            checked={_package.enabled}

            onChange={setFormValue(value => ({
                user_lists: {[idx]: {enabled: {$set: value}}}
            }))}

            {...props}
        />)}
    </>
}

