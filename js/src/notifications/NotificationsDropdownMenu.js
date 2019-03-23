/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import {NotificationsDropdownItem} from "./NotificationsDropdownItem";

export default class NotificationsDropdownMenu extends React.Component {
    getNotifications() {
        const notifications = this.props.notifications;
        if (notifications.length === 0)
            return <p className="dropdown-item text-center">{_("No notifications")}</p>;

        return notifications.map(
            (notification, idx) => {
                return <NotificationsDropdownItem
                    key={notification.id}
                    id={notification.id}
                    message={notification.msg}
                    severity={notification.severity}
                    created_at={notification.created_at}
                    dismissHandler={this.props.dismissHandler}
                    divider={idx + 1 !== notifications.length} //Don't show last divider
                />
            }
        );
    }

    render() {
        const notifications = this.getNotifications();
        const footer = this.props.notifications.length !== 0 ?
            <NotificationsDropdownFooter
                dismissAllHandler={this.props.dismissAllHandler} // TODO:
            /> : null;

        return <div className="dropdown-menu">
            <NotificationsDropdownHeader/>
            <div className="scrollable-menu">{notifications}</div>
            {footer}
        </div>

    }
}

function NotificationsDropdownHeader() {
    return <React.Fragment>
        <div id="notifications-header" className="dropdown-header">
            <h5>{_("Notifications")}</h5>
            <button className="btn btn-link">
                <i className="fa fa-cog fa"/>
            </button>
        </div>
        <div className="dropdown-divider dropdown-divider-top"/>
    </React.Fragment>;
}

function NotificationsDropdownFooter({dismissAllHandler}) {
    return <React.Fragment>
        <div className="dropdown-divider dropdown-divider-bottom"/>
        <div id="notifications-footer" className="dropdown-footer">
            <button
                className="btn btn-link"
                onClick={dismissAllHandler}
            >
                {_("Dismiss all")}
            </button>
        </div>
    </React.Fragment>
}
