/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import "./TopBar.css";

import RebootDropdown from "./rebootDropdown/RebootDropdown";
import UpdatesDropdown from "./updatesDropdown/UpdatesDropdown";
import NotificationsDropdown from "./NotificationsDropdown/NotificationsDropdown";
import LanguagesDropdown from "./languagesDropdown/LanguagesDropdown";
import LogoutButton from "./LogoutButton";

TopBar.propTypes = {
    ws: PropTypes.object.isRequired,
};

export default function TopBar({ ws }) {
    return (
        <>
            <RebootDropdown ws={ws} />
            <UpdatesDropdown ws={ws} />
            <NotificationsDropdown ws={ws} />
            <LanguagesDropdown ws={ws} />
            <LogoutButton />
        </>
    );
}
