/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import propTypes from 'prop-types';
import {useUID} from 'react-uid';

import {LABEL_SIZE, FIELD_SIZE} from './constants';


RadioSet.propTypes = {
    name: propTypes.string.isRequired,
    label: propTypes.string.isRequired,
    choices: propTypes.arrayOf(propTypes.shape({
        label: propTypes.string.isRequired,
        value: propTypes.oneOfType([propTypes.string, propTypes.number]).isRequired,
    })).isRequired,
    value: propTypes.string,
    helpText: propTypes.string,
};

export default function RadioSet({name, label, choices, value, helpText, ...props}) {
    const uid = useUID();
    const radios = choices.map((choice, key) => {
        return <Radio
            id={`${name}-${key}`}
            key={key}
            name={name}
            label={choice.label}
            value={choice.value}
            checked={choice.value === value}
            {...props}
        />;
    });

    return <div id={uid} className='form-group row'>
        <div className={'form-label col-sm-' + LABEL_SIZE}>
            <label className='form-label' htmlFor={uid}>{label}</label>
        </div>
        <div className={'col-sm-' + FIELD_SIZE}>
            {radios}
            <small className="form-text text-muted">{helpText}</small>
        </div>
    </div>;
}

Radio.propTypes = {
    label: propTypes.string.isRequired,
    id: propTypes.string.isRequired,
};

function Radio({label, id, ...props}) {
    return <div className='form-check form-check-inline'>
        <input
            id={id}
            className='form-check-input'
            type='radio'
            {...props}
        />
        <label className='form-check-label' htmlFor={id}>{label}</label>
    </div>;
}


