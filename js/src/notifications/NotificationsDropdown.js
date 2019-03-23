/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {ForisAPI} from "../api/api";
import {ForisURLs} from "../constants";


class NotificationsDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notifications: [],
            newNotification: false,
        }
    }

    componentDidMount() {
        this.loadNotifications();
        window.forisWS
            .subscribe('router_notifications')
            .bind('router_notifications', 'create',
                msg => {
                    this.loadNotifications();
                    this.setState({newNotification: true})
                }
            )
    }

    loadNotifications() {
        ForisAPI.notifications.get()
            .then(
                data => {
                    const nonDisplayedNotifications = data.notifications.filter(
                        notification => !notification.displayed
                    );
                    this.setState({
                        notifications: nonDisplayedNotifications
                    })
                }
            );
    }

    onDismiss = (notificationId) => {
        this.markNotificationAsDisplayed(notificationId);
        this.setState({
                notifications: this.state.notifications.filter((n) => n.id !== notificationId)
            }
        )
    };

    onClickDismissAll = (e) => {
        this.markNotificationsAsDisplayed(
            this.state.notifications.map(
                notification => notification.id
            )
        );
        this.setState({notifications: []})
    };


    markNotificationAsDisplayed(notificationId) {
        this.markNotificationsAsDisplayed([notificationId,]);
    }

    markNotificationsAsDisplayed(notificationIds) {
        const data = {ids: notificationIds};
        ForisAPI.notifications.post(data)
            .then(result => console.log(result));
    }


    getBellButton() {
        const notificationsCount = this.state.notifications.length;
        let circle = null;

        if (notificationsCount > 0) {
            circle = <div
                id="notifications-counter"
                className={this.state.newNotification ? 'jump' : ''}
                onAnimationEnd={() => this.setState({newNotification: false})}
            >
                <i className="fa fa-circle fa-stack-1x"/>
                <small className="circle-text fa-stack-1x">
                    {notificationsCount < 99 ? notificationsCount : "..."}
                </small>
            </div>
        }

        return <button
            id="notifications-btn"
            className="nav-item btn btn-link"
            type="button"
            onClick={this.redirectToNotificationCenter}
        >
            <span className="fa-stack">
                <i className="fa fa-bell fa-stack-1x"/>
                {circle}
            </span>
        </button>
    }

    getNotifications() {
        const notifications = this.state.notifications;
        if (notifications.length === 0)
            return <React.Fragment>
                <a className="dropdown-item disabled text-center" href="#">
                    {_("No notifications")}
                </a>
            </React.Fragment>;

        return notifications.map(
            (notification, idx) => {
                return <Notification
                    key={notification.id}
                    id={notification.id}
                    message={notification.msg}
                    severity={notification.severity}
                    created_at={notification.created_at}
                    onDismiss={this.onDismiss}
                    divider={idx + 1 !== notifications.length}
                    idx={idx}
                />
            }
        );
    }

    getFooter() {
        if (this.state.notifications.length === 0)
            return null;

        return <React.Fragment>
            <div className="dropdown-divider dropdown-divider-bottom"/>
            <div id="notifications-footer" className="dropdown-footer">
                <button
                    className="btn btn-link"
                    onClick={this.onClickDismissAll}
                >
                    {_("Dismiss all")}
                </button>
            </div>
        </React.Fragment>
    }

    redirectToNotificationCenter = (e) => {
        if (window.outerWidth > 699)
            return;
        e.preventDefault();
        document.location = ForisURLs.notifications;
    };

    render() {
        const notifications = this.getNotifications();
        const footer = this.getFooter();
        return <div id='notifications' className="dropdown btn-group">
            {this.getBellButton()}
            <div className="dropdown-menu">
                <div id="notifications-header" className="dropdown-header">
                    <h5>{_("Notifications")}</h5>

                    <button className="btn btn-link"><i className="fa fa-cog fa"/></button>
                </div>
                <div className="dropdown-divider dropdown-divider-top"/>

                <div className="scrollable-menu">
                    {notifications}
                </div>
                {footer}
            </div>

        </div>
    }
}

class Notification extends React.PureComponent {
    onDismiss = (e) => {
        e.preventDefault();
        this.props.onDismiss(this.props.id);
    };

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
        // TODO: Use locale
        return new Date(this.props.created_at).toLocaleDateString('en-US', options);
    }

    render() {
        const divider = this.props.divider ? <div className="dropdown-divider"/> : null;
        return <React.Fragment>
            <div className="dropdown-item notification-item">
                {this.getIcon()}
                <div className="notifications-info">
                    <small>
                        {this.getDate()}
                    </small>
                    <a
                        className="notification-message"
                        href="#"
                    >
                        {this.getMessage()}
                    </a>
                </div>
                <button className="btn btn-link" onClick={this.onDismiss}>
                    <i className="fas fa-times"/>
                </button>
            </div>
            {divider}
        </React.Fragment>;
    }
}

export default NotificationsDropdown;
