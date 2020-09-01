/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";

import RebootButton from "common/RebootButton";
import { toLocaleDateString } from "foris";
import NOTIFICATION_PROP_TYPES from "../utils";
import NotificationIcon from "../NotificationIcon";
import TruncatedText from "./TruncatedText";
import { NOT_DISMISSABLE } from "../constants";

NotificationsList.propTypes = {
    notifications: PropTypes.arrayOf(NOTIFICATION_PROP_TYPES),
    dismiss: PropTypes.func.isRequired,
};

export default function NotificationsList({
    notifications,
    dismiss,
    currentNotification,
}) {
    return notifications.map((notification) => (
        <NotificationsCenterItem
            key={notification.id}
            notification={notification}
            isCurrent={notification.id === currentNotification}
            dismiss={() => dismiss(notification.id)}
        />
    ));
}

const BORDER_TYPES = {
    news: "border-info",
    update: "border-info",
    restart: "border-danger",
    error: "border-danger",
};

const HIGHLIGHT_TYPES = {
    news: "highlight-info",
    update: "highlight-info",
    restart: "highlight-danger",
    error: "highlight-danger",
};

NotificationsCenterItem.propTypes = {
    notification: NOTIFICATION_PROP_TYPES,
    isCurrent: PropTypes.bool.isRequired,
    dismiss: PropTypes.func.isRequired,
};

function NotificationsCenterItem({ notification, isCurrent, dismiss }) {
    const notificationRef = useRef(null);

    useEffect(() => {
        if (isCurrent && notificationRef.current) {
            notificationRef.current.scrollIntoView({
                block: "start",
                behavior: "smooth",
            });
        }
    });
    const isDisableable = !NOT_DISMISSABLE.includes(notification.severity);
    return (
        <div
            ref={notificationRef}
            className={`card bg-light ${BORDER_TYPES[notification.severity]}`}
        >
            <div
                className={
                    isCurrent && notificationRef.current
                        ? `card-header ${
                              HIGHLIGHT_TYPES[notification.severity]
                          }`
                        : "card-header"
                }
            >
                <NotificationIcon
                    severity={notification.severity}
                    className="fa-lg"
                />
                <p className="text-muted align-middle m-0">
                    {toLocaleDateString(notification.created_at)}
                </p>
                <button
                    type="button"
                    className={`close ${!isDisableable ? "invisible" : ""}`}
                    onClick={dismiss}
                >
                    ×
                </button>
            </div>

            <div className="card-body">
                <TruncatedText text={notification.msg} charLimit={256} />
            </div>
            {notification.severity === "restart" ? <RebootButton /> : null}
        </div>
    );
}
