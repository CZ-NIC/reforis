/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {LABEL_SIZE, FIELD_SIZE} from './constants';


export default function Select({name, id, label, choices, value, onChange, disabled, helpText, ...props}) {

    let options = [];
    for (let key in choices)
        if (choices.hasOwnProperty(key))
            options.push(<option key={key} value={key}>{choices[key]}</option>);

    return <div className='form-group row'>
        <label className={'form-control-label col-sm-' + LABEL_SIZE} htmlFor={id}>{label}</label>
        <div className={'col-sm-' + FIELD_SIZE}>
            <select
                disabled={disabled}
                className='form-control'
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                {...props}
            >
                {options}
            </select>
            <small className="form-text text-muted">{helpText}</small>
        </div>
    </div>;
}


