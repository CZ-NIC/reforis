/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import propTypes from 'prop-types'

Alert.propTypes = {
    /** Type of the alert it adds as `alert-${type}` class.*/
    type: propTypes.string.isRequired,
    /** Alert message.*/
    message: propTypes.string,
    /** Alert content.*/
    children: propTypes.oneOfType([
        propTypes.arrayOf(propTypes.node),
        propTypes.node
    ]),
    /** onDismiss handler.*/
    onDismiss: propTypes.func
};


export default function Alert({type, message, onDismiss, children}) {
    return <div className={`alert alert-dismissible alert-${type}`}>
        {onDismiss ? <button type="button" className="close" onClick={onDismiss}>&times;</button> : false}
        {message}
        {children}
    </div>
}

