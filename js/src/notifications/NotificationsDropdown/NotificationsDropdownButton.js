/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import { ForisURLs, REFORIS_URL_PREFIX } from "common/constants";


const SMALL_SCREEN_WIDTH = 768;

NotificationsDropdownButton.propTypes = {
    notificationsCount: PropTypes.number.isRequired,
    newNotification: PropTypes.bool.isRequired,
};

export default function NotificationsDropdownButton({ notificationsCount, newNotification }) {
    function redirectToNotificationCenter(e) {
        // We don't want to show dropdown on the small devices.
        // So just make redirect to notification center
        if (window.outerWidth > SMALL_SCREEN_WIDTH) return;
        e.preventDefault();
        e.stopPropagation();
        document.location = `${REFORIS_URL_PREFIX}/${ForisURLs.notifications}`;
    }

    return (
        <button
            id="notifications-btn"
            className="nav-item btn btn-link"
            type="button"
            onClick={redirectToNotificationCenter}
        >
            <span className="fa-stack">
                <i className="fa fa-bell fa-stack-1x" />
                {
                    notificationsCount !== 0
                        ? (
                            <NotificationCounter
                                notificationsCount={notificationsCount}
                                newNotification={newNotification}
                            />
                        )
                        : null
                }
            </span>
        </button>
    );
}

NotificationCounter.propTypes = {
    notificationsCount: PropTypes.number.isRequired,
    newNotification: PropTypes.bool.isRequired,
};

function NotificationCounter({ notificationsCount, newNotification }) {
    return (
        <div
            id="notifications-counter"
            className={newNotification ? "jump" : ""}
        >
            <i className="fa fa-circle fa-stack-1x" />
            <small className="circle-text fa-stack-1x">
                {notificationsCount < 99 ? notificationsCount : "..."}
            </small>
        </div>
    );
}
