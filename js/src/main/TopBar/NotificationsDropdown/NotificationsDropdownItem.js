/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { ForisURLs, toLocaleDateString } from "foris";
import NotificationIcon from "notifications/NotificationIcon";
import NOTIFICATION_PROP_TYPES from "notifications/utils";

import "./NotificationsDropdownItem.css";
import { NOT_DISMISSABLE } from "notifications/constants";

NotificationsDropdownItem.propTypes = {
    notification: NOTIFICATION_PROP_TYPES,
    divider: PropTypes.bool.isRequired,
    dismiss: PropTypes.func.isRequired,
};

export default function NotificationsDropdownItem({
    notification,
    divider,
    dismiss,
}) {
    const date = toLocaleDateString(notification.created_at);

    const message = (
        <>
            <small className="text-muted">{date}</small>
            <p>{notification.msg}</p>
        </>
    );
    const isDisableable = !NOT_DISMISSABLE.includes(notification.severity);

    return (
        <>
            <div className="dropdown-item notification-item">
                <NotificationIcon
                    severity={notification.severity}
                    className="fa-2x"
                />
                <div className="notifications-info">
                    <Link
                        to={{
                            pathname: ForisURLs.overview,
                            search: `?id=${notification.id}`,
                        }}
                    >
                        {message}
                    </Link>
                </div>
                <button
                    type="button"
                    className={`btn btn-link dismiss${
                        !isDisableable ? " invisible" : ""
                    }`}
                    onClick={dismiss}
                >
                    <i className="fas fa-times" />
                </button>
            </div>
            {divider ? <div className="dropdown-divider" /> : null}
        </>
    );
}
