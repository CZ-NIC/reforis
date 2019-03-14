/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';

const OFFSET = 8;
const SIZE = 2;
const SIZE_CLASS = 'offset-' + OFFSET + ' col-sm-' + SIZE + ' ';

export function Button({className, children, ...props}) {
    className = className ? 'btn ' + SIZE_CLASS + className : 'btn btn-primary';

    return <button className={className} {...props}> {children} </button>;
}

export function LoadingButton({className, children, ...props}) {
    className = className ? 'disabled btn ' + SIZE_CLASS + className : 'disabled btn btn-primary';

    return <button className={className} {...props}>
        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"> </span>
        {children}
    </button>;
}
