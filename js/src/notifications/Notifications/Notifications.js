/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import UpdateApprovals from "./UpdateApprovals";
import NotificationsCenter from "./NotificationsCenter";

Notifications.propTypes = {
    ws: PropTypes.object.isRequired,
};

export default function Notifications({ ws }) {
    return (
        <>
            <UpdateApprovals />
            <NotificationsCenter ws={ws} />
        </>
    );
}
