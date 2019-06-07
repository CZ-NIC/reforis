/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import PropTypes from 'prop-types';

const OFFSET = 8;
const SIZE = 3;
const SIZE_CLASS = ' offset-lg-' + OFFSET + ' col-lg-' + SIZE;
const SIZE_CLASS_SM = ' col-sm-12';

Button.propTypes = {
    className: PropTypes.string,
    loading: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
    ]).isRequired
};

export default function Button({className, loading, children, forisFormSize, ...props}) {
    className = className ? 'btn ' + className : 'btn btn-primary ';
    if (forisFormSize)
        className += SIZE_CLASS + SIZE_CLASS_SM;

    const span = loading ?
        <span className='spinner-border spinner-border-sm' role='status' aria-hidden='true'/> : null;

    return <button className={className} {...props}>
        {span} {span ? ' ' : null} {children}
    </button>;
}
