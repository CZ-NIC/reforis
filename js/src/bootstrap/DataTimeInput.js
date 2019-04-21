/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Datetime from 'react-datetime';
import moment from 'moment';

import Input from './Input';

DataTimeInput.propTypes = {
    label: PropTypes.string.isRequired,
    error: PropTypes.string,
    value: PropTypes.objectOf(moment),
    helpText: PropTypes.string,
};

export default function DataTimeInput({value, onChange, isValidDate, children, ...props}) {
    function renderInput(datetimeProps) {
        return <Input
            {...props}
            {...datetimeProps}
        >
            {children}
        </Input>
    }

    return <Datetime
        locale={ForisTranslations.locale}
        value={value}
        onChange={onChange}
        isValidDate={isValidDate}
        renderInput={renderInput}
        dateFormat="YYYY-MM-DD"
        timeFormat="HH:mm:ss"
    />;
}

