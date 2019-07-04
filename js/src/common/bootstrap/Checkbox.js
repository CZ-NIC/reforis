/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import PropTypes from 'prop-types';
import {useUID} from 'react-uid/dist/es5/index';

import {formFieldsSize} from './constants';

CheckBox.propTypes = {
    /** Label message*/
    label: PropTypes.string.isRequired,
    /** Help text message*/
    helpText: PropTypes.string,
};

export default function CheckBox({label, helpText, ...props}) {
    const uid = useUID();
    return <div className={formFieldsSize} style={{marginBottom: '1rem'}}>
        <div className='form-group form-check' style={{marginBottom: '0'}}>
            <input
                className='form-check-input'
                type='checkbox'
                id={uid}

                {...props}
            />
            <label className='form-label' htmlFor={uid} style={helpText ? {marginBottom: '0'} : null}>{label}</label>
        </div>
        {helpText ? <small className="form-text text-muted">{helpText}</small> : null}
    </div>
}
