/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

export class NotificationsItem extends React.PureComponent {
    getIcon() {
        let iconName = null;
        switch (this.props.severity) {
            case 'news':
                iconName = 'newspaper';
                break;
            case 'restart':
                iconName = 'power-off';
                break;
            case 'error':
                iconName = 'exclamation-circle';
                break;
            case 'update':
                iconName = 'sync';
                break;
            default:
                return null;
        }

        return <i className={'fa fa-2x fa-' + iconName}/>
    }

    getMessage() {
        const maxLength = 25;
        const message = this.props.message;
        if (message.length > maxLength)
            return message.substring(0, maxLength) + '...';
        else
            return message;
    }

    getDate() {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        };
        return new Date(this.props.created_at).toLocaleDateString(ForisTranslations.locale, options);
    }

    getDivider() {
        return this.props.divider ? <div className="dropdown-divider"/> : null;
    }

    dismissHandler = (e) => {
        e.preventDefault();
        this.props.dismissHandler(this.props.id);
    };

    render() {
        const icon = this.getIcon();
        const divider = this.getDivider();
        const message = this.getMessage();
        const date = this.getDate();

        return <React.Fragment>
            <div className="dropdown-item notification-item">
                {icon}
                <div className="notifications-info">
                    <small>{date}</small>
                    <a href="#" className="notification-message">
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
