/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import NetworkRestartHandler from "./NetworkRestartHandler";
import RebootHandler from "./RebootHandler";

RouterStateHandler.propTypes = {
    ws: PropTypes.object.isRequired,
};

export default function RouterStateHandler({ ws }) {
    return (
        <>
            <NetworkRestartHandler ws={ws} />
            <RebootHandler ws={ws} />
        </>
    );
}
