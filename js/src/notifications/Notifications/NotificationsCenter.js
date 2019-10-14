/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";

import useNotifications from "../hooks";
import NotificationsList from "./NotificationsList";

NotificationsCenter.propTypes = {
    ws: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

function NotificationsCenter({ ws, history }) {
    const [notifications, dismiss, dismissAll] = useNotifications(ws);
    const [currentNotification, setCurrentNotification] = useState();

    useEffect(() => {
        const unlisten = history.listen(
            (location) => {
                setCurrentNotification(location.search);
            },
        );
        return unlisten;
    }, [history, setCurrentNotification]);

    function getDismissAllButton() {
        return (
            <button
                type="button"
                id="btn-dismiss-all"
                className="btn btn-outline-danger float-right"
                onClick={dismissAll}
            >
                {_("Dismiss all")}
            </button>
        );
    }

    return (
        <div id="notifications-center">
            <h1>{_("Notifications")}</h1>
            {notifications.length !== 0
                ? getDismissAllButton()
                : <p className="text-muted text-center">{_("No notifications")}</p>}
            <NotificationsList
                currentNotification={currentNotification}
                notifications={notifications}
                dismiss={dismiss}
            />
        </div>
    );
}

export default withRouter(NotificationsCenter);
