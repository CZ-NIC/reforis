/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import NotificationsDropdownButton from "./NotificationsDropdownButton";
import NotificationsDropdownMenu from "./NotificationsDropdownMenu";
import NotificationsWrapper from "./NotificationsWrapper";


class NotificationsDropdown extends React.Component {
    render() {
        return <div id='notifications' className="dropdown btn-group">
            <NotificationsDropdownButton
                notificationsCount={this.props.notifications.length}
                newNotification={this.props.newNotification}

                disableNewNotification={this.props.disableNewNotification}
            />
            <NotificationsDropdownMenu
                notifications={this.props.notifications}

                dismissHandler={this.props.dismissHandler}
                dismissAllHandler={this.props.dismissAllHandler}
            />
        </div>
    }
}

export default NotificationsWrapper(NotificationsDropdown);