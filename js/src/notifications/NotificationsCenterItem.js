/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */
import React from 'react';
import NotificationIcon from "./NotificationIcon";
import {toLocaleDateString} from "./utils";

const BORDER_TYPES = {
    news: 'border-info',
    update: 'border-info',
    restart: 'border-danger',
    error: 'border-danger',
};

export default class NotificationsCenterItem extends React.Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
    }

    componentDidMount() {
        // Hack to scroll to needed item. ForisNotificationID is defined in the notification center template.
        if (window.ForisNotificationID === undefined)
            return;
        if (window.ForisNotificationID === this.props.notification.id)
            this.myRef.current.scrollIntoView({block: 'start', behavior: 'smooth'});
    }

    render() {
        const notification = this.props.notification;
        return <div ref={this.myRef} className={`card bg-light ${BORDER_TYPES[notification.severity]} sm-10`}>
            <div className="card-header">
                <NotificationIcon severity={notification.severity} className={'fa-2x'}/>
                <p className="text-muted">{toLocaleDateString(notification.created_at)}</p>
                <button
                    type="button"
                    className="close"
                    onClick={e => this.props.dismissHandler(notification.id)}
                >×
                </button>
            </div>

            <div className="card-body">
                <p className="card-text">{notification.msg}</p>
            </div>
        </div>;
    }
}

