/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import { Spinner } from "foris";
import { STATES, useReboot } from "./hooks";

RebootHandler.propTypes = {
    ws: PropTypes.object.isRequired,
    controllerID: PropTypes.string,
};

export default function RebootHandler({ ws, controllerID }) {
    const [rebootState, remains] = useReboot(ws, controllerID);

    if (rebootState === STATES.NOT_TRIGGERED) return null;

    let message;
    switch (rebootState) {
        case STATES.TRIGGERED:
            message = babel.format(_("Reboot after %d sec."), remains || 0);
            break;
        case STATES.IN_PROGRESS:
            message = _("Rebooting");
            break;
        case STATES.DONE:
            message = _("Reconnecting");
            break;
        default:
    }

    return (
        <Spinner fullScreen>
            <h3>{message}</h3>
        </Spinner>
    );
}
