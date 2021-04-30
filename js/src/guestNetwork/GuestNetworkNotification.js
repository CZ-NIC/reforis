/*
 * Copyright (C) 2020-2021 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";
import { Portal, Alert, ALERT_TYPES } from "foris";

export const NO_INTERFACE_WARNING = _(`This network currently doesn't contain \
any devices. The changes you make here will become fully functional after you \
assign a network interface to this network.`);

export const NO_INTERFACE_UP_WARNING = _(
    "All network interfaces of this network are currently down."
);

GuestNetworkNotification.propTypes = {
    formData: PropTypes.shape({
        interface_count: PropTypes.number,
        interface_up_count: PropTypes.number,
        enabled: PropTypes.bool,
    }).isRequired,
};

GuestNetworkNotification.defaultProps = {
    formData: {},
};

export default function GuestNetworkNotification({ formData }) {
    return (
        <>
            {formData.enabled && (
                <Portal containerId="guest-notification">
                    {formData.interface_count === 0 ? (
                        <Alert type={ALERT_TYPES.WARNING}>
                            {NO_INTERFACE_WARNING}
                        </Alert>
                    ) : (
                        formData.interface_up_count === 0 && (
                            <Alert type={ALERT_TYPES.WARNING}>
                                {NO_INTERFACE_UP_WARNING}
                            </Alert>
                        )
                    )}
                </Portal>
            )}
        </>
    );
}
