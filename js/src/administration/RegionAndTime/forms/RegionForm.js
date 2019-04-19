/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import propTypes from 'prop-types';

import PasswordInput from '../../../bootstrap/PasswordInput';

RegionForm.propTypes = {
    formData: propTypes.shape(
        {newForisPassword: propTypes.string}
    ).isRequired,
    setFormValue: propTypes.func.isRequired,
};

export default function RegionForm({formData, setFormValue, ...props}) {
    return <>

    </>
}
