/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import propTypes from 'prop-types';

NotificationIcon.propTypes = {
    severity: propTypes.string.isRequired,
    className: propTypes.string,
};

export default function NotificationIcon({severity, className}) {
    let iconName = null;
    switch (severity) {
        case 'news':
            iconName = 'newspaper';
            break;
        case 'restart':
            iconName = 'power-off';
            break;
        case 'error':
            iconName = 'exclamation-circle';
            break;
        case 'update':
            iconName = 'sync';
            break;
        default:
    }

    return <i className={`fa fa-${iconName} ${className}`}/>;
}