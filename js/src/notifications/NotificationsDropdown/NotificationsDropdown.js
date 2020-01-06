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
import useNotifications, { useNewNotification } from "../hooks";

NotificationsDropdown.propTypes = {
    ws: PropTypes.object.isRequired,
};

export default function NotificationsDropdown({ ws }) {
    const [notifications, dismiss, dismissAll, isLoading] = useNotifications(ws);
    const newNotification = useNewNotification(ws);
    return (
        <div id="notifications" className="dropdown btn-group">
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
