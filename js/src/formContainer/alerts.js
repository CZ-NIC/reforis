/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import propTypes from 'prop-types';

import Alert from '../common/bootstrap/Alert';

const ALERT_CONTAINER_ID = 'alert_container';

SuccessAlert.propTypes = {
    onDismiss: propTypes.func.isRequired,
};

export function SuccessAlert({onDismiss}) {
    const alert = <Alert
        type='success'
        message={_('Settings were successfully saved.')}
        onDismiss={onDismiss}
    />;

    const alertContainer = document.getElementById(ALERT_CONTAINER_ID);
    return ReactDOM.createPortal(
        alert,
        alertContainer,
    )
}

FailAlert.propTypes = {
    onDismiss: propTypes.func.isRequired,
};

export function FailAlert({onDismiss}) {
    const alertContainer = document.getElementById(ALERT_CONTAINER_ID);
    const alert = <Alert
        type='danger'
        message={_('Settings update was failed.')}
        onDismiss={onDismiss}
    />;

    return ReactDOM.createPortal(
        alert,
        alertContainer,
    )
}
