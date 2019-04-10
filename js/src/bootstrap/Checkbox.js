/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import PropTypes from 'prop-types';
import {useUID} from 'react-uid';

import {LABEL_SIZE, FIELD_SIZE} from './constants';

CheckBox.propTypes = {
    label: PropTypes.string.isRequired,
    helpText: PropTypes.string,
};

export default function CheckBox({label, helpText, ...props}) {
    const uid = useUID();
    return <div className='form-group row'>
        <div className={'form-label col-sm-' + LABEL_SIZE}>
            <label className='form-label' htmlFor={uid}>{label}</label>
        </div>
        <div className={'form-check col-sm-' + FIELD_SIZE}>
            <input
                type='checkbox'
                id={uid}
                {...props}
            />
            <small className="form-text text-muted">{helpText}</small>
        </div>
    </div>;
}