/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';

const OFFSET = 8;
const SIZE = 2;
const SIZE_CLASS = ' offset-' + OFFSET + ' col-sm-' + SIZE;

export default function Button({className, loading, children, ...props}) {
    className = className ? 'btn ' + className : 'btn btn-primary ';
    className += SIZE_CLASS;

    const span = loading ?
        <span className='spinner-border spinner-border-sm' role='status' aria-hidden='true'/> : null;

    return <button className={className} {...props}>
        {span} {span ? ' ' : null} {children}
    </button>;
}
