/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { Spinner } from "foris";

import useNotifications from "../hooks";
import NotificationsList from "./NotificationsList";
import "./Notifications.css";

Notifications.propTypes = {
    ws: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

function Notifications({ ws, history }) {
    const [notifications, dismiss, dismissAll, isLoading] = useNotifications(ws);
    const [currentNotification, setCurrentNotification] = useState();

    function getIDFromSearch(search) {
        const params = new URLSearchParams(search);
        return params.get("id");
    }

    useEffect(() => {
        // Set initial notification
        setCurrentNotification(getIDFromSearch(window.location.search));
        // Listen to changes
        const unlisten = history.listen(
            (location) => {
                setCurrentNotification(getIDFromSearch(location.search));
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

    let componentContent;
    if (isLoading) {
        componentContent = <Spinner />;
    } else {
        componentContent = (
            <>
                {notifications.length !== 0
                    ? getDismissAllButton()
                    : <p className="text-muted text-center">{_("No notifications")}</p>}
                <NotificationsList
                    currentNotification={currentNotification}
                    notifications={notifications}
                    dismiss={dismiss}
                />
            </>
        );
    }

    return (
        <div id="notifications-center">
            <h1>{_("Notifications")}</h1>
            {componentContent}
        </div>
    );
}

export default withRouter(Notifications);
