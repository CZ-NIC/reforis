/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import propTypes from 'prop-types'

Alert.propTypes = {
    type: propTypes.string.isRequired,
    message: propTypes.string.isRequired,
};

export default function Alert({type, message, onDismiss}) {
    return <div className={`alert alert-dismissible alert-${type}`}>
        {onDismiss ? <button type="button" className="close" onClick={onDismiss}>&times;</button> : false}
        {message}
    </div>
}