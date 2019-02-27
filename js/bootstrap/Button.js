/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';

export default function Button({icon, className, children, ...props}) {
    className = className ? 'btn ' + className : 'btn btn-primary';

    if (icon)
        icon = <span className={`fa fa-${icon}`}/>;

    return <button className={className} {...props}> {icon} {children} </button>;
}
