/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import {ForisURLs} from "../constants";

const SMALL_SCREEN = 699;

export default class NotificationsDropdownButton extends React.PureComponent {
    redirectToNotificationCenter = (e) => {
        // We don't want to show dropdown on the small devices.
        // So just make redirect to notification center
        if (window.outerWidth > SMALL_SCREEN)
            return;
        e.preventDefault();
        e.stopPropagation();
        document.location = ForisURLs.notifications;
    };

    render() {
        return <button
            id="notifications-btn"
            className="nav-item btn btn-link"
            type="button"
            onClick={this.redirectToNotificationCenter}
        >
            <span className="fa-stack">
                <i className="fa fa-bell fa-stack-1x"/>
                {
                    this.props.notificationsCount !== 0 ?
                        <NotificationCounter
                            notificationsCount={this.props.notificationsCount}
                            newNotification={this.props.newNotification}

                            disableNewNotification={this.props.disableNewNotification}
                        />
                        : null
                }
            </span>
        </button>
    }
}

function NotificationCounter({notificationsCount, newNotification, disableNewNotification}) {
    return <div
        id="notifications-counter"
        className={newNotification ? 'jump' : ''}
        onAnimationEnd={disableNewNotification}
    >
        <i className="fa fa-circle fa-stack-1x"/>
        <small className="circle-text fa-stack-1x">
            {notificationsCount < 99 ? notificationsCount : "..."}
        </small>
    </div>
}
