/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import NotificationIcon from "./NotificationIcon";
import {toLocaleDateString} from "./utils";
import {ForisURLs} from "../constants";

export class NotificationsDropdownItem extends React.PureComponent {
    getMessage() {
        const maxLength = 25;
        const message = this.props.message;
        if (message.length > maxLength)
            return message.substring(0, maxLength) + '...';
        else
            return message;
    }

    getDivider() {
        return this.props.divider ? <div className="dropdown-divider"/> : null;
    }

    dismissHandler = (e) => {
        e.preventDefault();
        this.props.dismissHandler(this.props.id);
    };

    render() {
        const divider = this.getDivider();
        const message = this.getMessage();
        const date = toLocaleDateString(this.props.created_at);

        return <React.Fragment>
            <div className="dropdown-item notification-item">
                <NotificationIcon severity={this.props.severity} className={'fa-2x'}/>
                <div className="notifications-info">
                    <small className="text-muted">{date}</small>
                    <a href={`${ForisURLs.notifications}?id=${this.props.id}`} className="notification-message">
                        {message}
                    </a>
                </div>
                <button className="btn btn-link" onClick={this.dismissHandler}>
                    <i className="fas fa-times"/>
                </button>
            </div>
            {divider}
        </React.Fragment>;
    }
}
