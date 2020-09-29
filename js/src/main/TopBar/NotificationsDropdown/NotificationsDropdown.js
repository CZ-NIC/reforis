/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import NotificationsDropdownButton from "./NotificationsDropdownButton";
import NotificationsDropdownMenu from "./NotificationsDropdownMenu";
import "./NotificationsDropdown.css";

NotificationsDropdown.propTypes = {
    notifications: PropTypes.array.isRequired,
    newNotification: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    dismiss: PropTypes.func.isRequired,
    dismissAll: PropTypes.func.isRequired,
};

export default function NotificationsDropdown({
    notifications,
    dismiss,
    dismissAll,
    isLoading,
    newNotification,
}) {
    return (
        <div id="notifications" className="dropdown">
            <NotificationsDropdownButton
                notificationsCount={notifications.length}
                newNotification={newNotification}
                isLoading={isLoading}
            />
            <NotificationsDropdownMenu
                notifications={notifications}
                dismiss={dismiss}
                dismissAll={dismissAll}
            />
        </div>
    );
}
