/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import PropTypes from 'prop-types';
import {useUID} from 'react-uid/dist/es5/index';

import {FIELD_SIZE, LABEL_SIZE} from './constants';

CheckBox.propTypes = {
    /** Label message*/
    label: PropTypes.string.isRequired,
    /** Help text message*/
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
            {helpText ? <small className="form-text text-muted">{helpText}</small> : null}
        </div>
    </div>;
}
