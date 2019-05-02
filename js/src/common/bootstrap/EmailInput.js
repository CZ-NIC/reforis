/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';

import Input from './Input';
import PropTypes from 'prop-types';

const EmailInput = ({...props}) => <Input type="email" {...props}/>;


EmailInput.propTypes = {
    label: PropTypes.string.isRequired,
    error: PropTypes.string,
    helpText: PropTypes.string,
    value: PropTypes.string,
};

export default EmailInput;
