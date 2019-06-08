/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, {useState} from 'react';
import PropTypes from 'prop-types';

import Input from './Input';

PasswordInput.propTypes = {
    label: PropTypes.string.isRequired,
    error: PropTypes.string,
    value: PropTypes.string,
    helpText: PropTypes.string,
};

export default function PasswordInput({withEye, ...props}) {
    const [isHidden, setHidden] = useState(true);
    return <Input
        type={withEye ? isHidden ? 'password' : 'text' : 'password'}
        autoComplete={isHidden ? 'new-password' : null}
        {...props}
    >
        {withEye ?
            <div className="input-group-append">
                <button className="input-group-text" onClick={e => {
                    e.preventDefault();
                    setHidden(isHidden => !isHidden);
                }}>
                    <i className={'fa ' + (isHidden ? 'fa-eye' : 'fa-eye-slash')}/>
                </button>
            </div>
            : null}
    </Input>
}
