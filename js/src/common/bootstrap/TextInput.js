/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import PropTypes from 'prop-types';

import Input from './Input';


const TextInput = ({...props}) => <Input type="text" {...props}/>;


TextInput.propTypes = {
    /** Field label. */
    label: PropTypes.string.isRequired,
    /** Error text. */
    error: PropTypes.string,
    /** Help text message. */
    helpText: PropTypes.string,
};

export default TextInput;
