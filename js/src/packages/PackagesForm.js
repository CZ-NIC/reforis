/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import propTypes from 'prop-types';

import CheckBox from 'common/bootstrap/Checkbox';

PackagesForm.propTypes = {
    formData: propTypes.shape({
        user_lists: propTypes.arrayOf(propTypes.shape({
            title: propTypes.string.isRequired,
            msg: propTypes.string.isRequired,
            enabled: propTypes.bool.isRequired,
        })).isRequired,
    }),
    setFormValue: propTypes.func,
    disabled: propTypes.bool
};

export default function PackagesForm({formData, setFormValue, disabled}) {
    return <>
        <h3>{_('Packages list')}</h3>
        {formData.user_lists.map(
            (_package, idx) => <CheckBox
                label={_package.title}
                key={idx}
                helpText={_package.msg}
                checked={_package.enabled}
                disabled={disabled}

                onChange={setFormValue(value => ({
                    user_lists: {[idx]: {enabled: {$set: value}}}
                }))}
            />
        )}
    </>
}

