/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import Alert from "common/bootstrap/Alert";
import Portal from "utils/Portal";

SuccessAlert.propTypes = {
    onDismiss: PropTypes.func.isRequired,
};

const ALERT_CONTAINER_ID = "alert_container";

export function SuccessAlert({ onDismiss }) {
    return (
        <Portal containerId={ALERT_CONTAINER_ID}>
            <Alert
                type="success"
                message={_("Settings were successfully saved.")}
                onDismiss={onDismiss}
            />
        </Portal>
    );
}

FailAlert.propTypes = {
    onDismiss: PropTypes.func.isRequired,
};

export function FailAlert({ onDismiss }) {
    return (
        <Portal containerId={ALERT_CONTAINER_ID}>
            <Alert
                type="danger"
                message={_("Settings update was failed.")}
                onDismiss={onDismiss}
            />
        </Portal>
    );
}
