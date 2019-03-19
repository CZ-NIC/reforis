/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {LABEL_SIZE, FIELD_SIZE} from './constants';

export default function RadioSet({name, id, label, choices, value, onChange, ...props}) {
    const radios = choices.map((choice, key) => {
        return <Radio
            key={key}
            name={name}
            label={choice.label}
            value={choice.value}
            onChange={onChange}
            checked={choice.value === value}
            {...props}
        />;
    });

    return <div id={id} className='form-group row'>
        <div className={'form-label col-sm-' + LABEL_SIZE}>
            <label className='form-label' htmlFor={id}>{label}</label>
        </div>
        <div className={'col-sm-' + FIELD_SIZE}>{radios}</div>
    </div>;
}

function Radio({name, label, value, onChange, checked = false,...props}) {
    let id = name + value;
    return <div className='form-check form-check-inline'>
        <input
            className='form-check-input'
            type='radio'
            name={name}
            id={id}
            value={value}
            onChange={onChange}
            checked={checked}
            {...props}
        />
        <label className='form-check-label' htmlFor={id}>{label}</label>
    </div>;
}


