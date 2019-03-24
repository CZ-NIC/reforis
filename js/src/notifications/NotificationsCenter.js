/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */


import React from "react";
import NotificationsWrapper from "./NotificationsWrapper";
import NotificationsCenterItem from "./NotificationsCenterItem";

class NotificationsCenter extends React.PureComponent {
    getDismissAllButton() {
        return <button
            type="button"
            id="btn-dismiss-all"
            className="btn btn-outline-danger float-right"
            onClick={this.props.dismissAllHandler}
        >
            {_('Dismiss all')}
        </button>
    }

    render() {

        return <div id='notifications-center' className="col-sm-10">
            <h3>{_('Settings')}</h3>
            <h3>{_('Notifications')}</h3>
            {
                this.props.notifications.length !== 0 ?
                    this.getDismissAllButton() :
                    <p className="text-muted text-center">{_('No notifications')}</p>
            }

            <NotificationsCenterItemsList
                notifications={this.props.notifications}

                dismissHandler={this.props.dismissHandler}
            />
        </div>
    }
}

function NotificationsCenterItemsList({notifications, dismissHandler}) {
    return notifications.map(
        notification => {
            return <NotificationsCenterItem
                key={notification.id}
                notification={notification}
                dismissHandler={dismissHandler}
            />
        }
    )
}

export default NotificationsWrapper(NotificationsCenter);