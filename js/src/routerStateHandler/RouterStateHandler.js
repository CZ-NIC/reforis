/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { useAPIGet, API_STATE } from "foris";

import API_URLs from "common/API";
import NetworkRestartHandler from "./NetworkRestartHandler";
import RebootHandler from "./RebootHandler";

RouterStateHandler.propTypes = {
    ws: PropTypes.object.isRequired,
};

export default function RouterStateHandler({ ws }) {
    const [controllerID, setControllerID] = useState();
    const [getControllerIDResponse, getControllerID] = useAPIGet(
        API_URLs.controllerID
    );
    useEffect(() => {
        getControllerID();
    }, [getControllerID]);

    useEffect(() => {
        if (getControllerIDResponse.state === API_STATE.SUCCESS) {
            setControllerID(getControllerIDResponse.data);
        } else if (getControllerIDResponse.state === API_STATE.ERROR) {
            // eslint-disable-next-line no-console
            console.error(
                "Cannot get controller ID. Filtering WebSocket messages is disabled."
            );
        }
    }, [getControllerIDResponse]);

    return (
        <>
            <NetworkRestartHandler ws={ws} controllerID={controllerID} />
            <RebootHandler ws={ws} controllerID={controllerID} />
        </>
    );
}
