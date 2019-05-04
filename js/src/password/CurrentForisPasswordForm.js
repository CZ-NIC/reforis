/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';

import PasswordInput from '../common/bootstrap/PasswordInput';
import propTypes from 'prop-types';
import ForisPasswordForm from './ForisPasswordForm';

ForisPasswordForm.propTypes = {
    formData: propTypes.shape(
        {newForisPassword: propTypes.string}
    ).isRequired,
    setFormValue: propTypes.func.isRequired,
};

export default function CurrentForisPasswordForm({formData, setFormValue, ...props}) {
    return <PasswordInput
        withEye={true}
        label={_('Current Foris password')}
        value={formData.currentForisPassword}

        onChange={setFormValue(
            value => ({currentForisPassword: {$set: value}})
        )}

        {...props}
    />
}
