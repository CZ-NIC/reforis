/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {useUID} from 'react-uid';

import {LABEL_SIZE, FIELD_SIZE} from './constants';


const Input = type => ({label, helpText, error, ...props}) => {
    const uid = useUID();
    return <div className='form-group row'>
        <label className={'form-control-label col-sm-' + LABEL_SIZE} htmlFor={uid}>{label}</label>
        <div className={'col-sm-' + FIELD_SIZE}>
            <input
                className={'form-control ' + (!error ? '' : 'is-invalid')}
                type={type}
                id={uid}
                {...props}
            />
            <div className='invalid-feedback'>{error}</div>
            <small className="form-text text-muted">{helpText}</small>
        </div>
    </div>;
};

export default Input;
