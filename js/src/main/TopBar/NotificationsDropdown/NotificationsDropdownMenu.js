/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { ForisURLs } from "foris";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

import NOTIFICATION_PROP_TYPES from "../../../notifications/utils";
import NotificationsDropdownItem from "./NotificationsDropdownItem";
import "./NotificationsDropdownMenu.css";

NotificationsDropdownMenu.propTypes = {
    notifications: PropTypes.arrayOf(NOTIFICATION_PROP_TYPES),
    dismiss: PropTypes.func.isRequired,
    dismissAll: PropTypes.func.isRequired,
};

export default function NotificationsDropdownMenu({
    notifications,
    dismiss,
    dismissAll,
}) {
    function getNotifications() {
        if (notifications.length === 0) {
            return (
                <span className="dropdown-item no-notifications">
                    {_("No notifications")}
                </span>
            );
        }

        return notifications.map((notification, idx) => (
            <NotificationsDropdownItem
                key={notification.id}
                notification={notification}
                divider={idx + 1 !== notifications.length} // Don't show last divider
                dismiss={() => dismiss(notification.id)}
            />
        ));
    }

    const footer =
        notifications.length !== 0 ? (
            <NotificationsDropdownFooter dismissAll={dismissAll} />
        ) : null;

    return (
        <div className="dropdown-menu dropdown-menu-right shadow-sm">
            <NotificationsDropdownHeader />
            <SimpleBar className="scrollable-menu" autoHide={false}>
                {getNotifications()}
            </SimpleBar>
            {footer}
        </div>
    );
}

function NotificationsDropdownHeader() {
    return (
        <>
            <div id="notifications-header" className="dropdown-header">
                <Link
                    to={{
                        pathname: ForisURLs.overview,
                        hash: `#notifications`,
                    }}
                >
                    <h5>{_("Notifications")}</h5>
                </Link>
                <Link
                    to={ForisURLs.notificationsSettings}
                    className="btn btn-link"
                >
                    <i className="fas fa-cog fa-fw" />
                </Link>
            </div>
            <div className="dropdown-divider dropdown-divider-top" />
        </>
    );
}

NotificationsDropdownFooter.propTypes = {
    dismissAll: PropTypes.func.isRequired,
};

function NotificationsDropdownFooter({ dismissAll }) {
    return (
        <>
            <div className="dropdown-divider dropdown-divider-bottom" />
            <div id="notifications-footer" className="dropdown-footer">
                <button
                    type="button"
                    className="btn btn-link"
                    onClick={dismissAll}
                >
                    {_("Dismiss all")}
                </button>
            </div>
        </>
    );
}
