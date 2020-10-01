/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import useNotifications, {
    useNewNotification,
} from "../../notifications/hooks";
import RebootDropdown from "./rebootDropdown/RebootDropdown";
import UpdatesDropdown from "./updatesDropdown/UpdatesDropdown";
import NotificationsDropdown from "./NotificationsDropdown/NotificationsDropdown";
import LanguagesDropdown from "./languagesDropdown/LanguagesDropdown";
import LogoutButton from "./LogoutButton";

import "./TopBar.css";

TopBar.propTypes = {
    ws: PropTypes.object.isRequired,
};

export default function TopBar({ ws }) {
    const [notifications, dismiss, dismissAll, isLoading] = useNotifications(
        ws
    );
    const newNotification = useNewNotification(ws);
    return (
        <>
            <RebootDropdown notifications={notifications} />
            <UpdatesDropdown newNotification={newNotification} />
            <NotificationsDropdown
                notifications={notifications}
                dismiss={dismiss}
                dismissAll={dismissAll}
                isLoading={isLoading}
                newNotification={newNotification}
            />
            <LanguagesDropdown ws={ws} />
            <LogoutButton />
        </>
    );
}
