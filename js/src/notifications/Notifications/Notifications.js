/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { Spinner } from "foris";

import "./Notifications.css";
import useNotifications from "../hooks";
import { NOT_DISMISSABLE } from "../constants";
import NotificationsList from "./NotificationsList";
import DismissAllButton from "./DismissAllButton";

Notifications.propTypes = {
    ws: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

function Notifications({ ws, history }) {
    const [notifications, dismiss, dismissAll, isLoading] = useNotifications(
        ws
    );
    const [currentNotification, setCurrentNotification] = useState();

    const [notificationSection, setNotificationSection] = useState();

    function getIDFromSearch(search) {
        const params = new URLSearchParams(search);
        return params.get("id");
    }

    useEffect(() => {
        // Set initial notification
        setCurrentNotification(getIDFromSearch(window.location.search));
        // Listen to changes
        return history.listen((location) => {
            setCurrentNotification(getIDFromSearch(location.search));
        });
    }, [history, setCurrentNotification]);

    const notificationSectionRef = useRef(null);

    useEffect(() => {
        setNotificationSection(window.location.hash);

        if (notificationSection && notificationSectionRef.current) {
            notificationSectionRef.current.scrollIntoView({
                block: "start",
                behavior: "smooth",
            });
        }
        return history.listen((location) => {
            setNotificationSection(location.hash);
        });
    }, [notificationSection, history]);

    let componentContent;
    const dismissableNotificationsCount = notifications.filter(
        (notification) => !NOT_DISMISSABLE.includes(notification.severity)
    ).length;

    if (isLoading) {
        componentContent = <Spinner />;
    } else if (notifications.length === 0) {
        componentContent = (
            <p className="text-muted text-center">{_("No notifications")}</p>
        );
    } else {
        componentContent = (
            <NotificationsList
                currentNotification={currentNotification}
                notifications={notifications}
                dismiss={dismiss}
            />
        );
    }

    return (
        <>
            <h1 ref={notificationSectionRef}>
                {_("Notifications")}
                {dismissableNotificationsCount > 0 && (
                    <DismissAllButton dismissAll={dismissAll} />
                )}
            </h1>
            <div id="notifications-center">{componentContent}</div>
        </>
    );
}

export default withRouter(Notifications);
