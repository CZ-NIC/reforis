/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import propTypes from 'prop-types';

import {ForisURLs} from '../../common/constants';

import {NOTIFICATION_PROP_TYPES} from '../utils';
import NotificationsDropdownItem from './NotificationsDropdownItem';


NotificationsDropdownMenu.propTypes = {
    notifications: propTypes.arrayOf(NOTIFICATION_PROP_TYPES),
    dismiss: propTypes.func.isRequired,
    dismissAll: propTypes.func.isRequired,
};

export default function NotificationsDropdownMenu({notifications, dismiss, dismissAll}) {
    function getNotifications() {
        if (notifications.length === 0)
            return <p className='dropdown-item text-center'>{_('No notifications')}</p>;

        return notifications.map(
            (notification, idx) => {
                return <NotificationsDropdownItem
                    key={notification.id}
                    notification={notification}
                    divider={idx + 1 !== notifications.length} //Don't show last divider

                    dismiss={() => dismiss(notification.id)}
                />
            }
        );
    }

    const footer = notifications.length !== 0 ?
        <NotificationsDropdownFooter dismissAll={dismissAll}/>
        : null;

    return <div className='dropdown-menu'>
        <NotificationsDropdownHeader/>
        <div className='scrollable-menu'>{getNotifications()}</div>
        {footer}
    </div>

}

function NotificationsDropdownHeader() {
    return <>
        <div id='notifications-header' className='dropdown-header'>
            <h5>{_('Notifications')}</h5>
            <a href={ForisURLs.notifications} className='btn btn-link'>
                <i className='fa fa-cog fa'/>
            </a>
        </div>
        <div className='dropdown-divider dropdown-divider-top'/>
    </>;
}

function NotificationsDropdownFooter({dismissAll}) {
    return <>
        <div className='dropdown-divider dropdown-divider-bottom'/>
        <div id='notifications-footer' className='dropdown-footer'>
            <button
                className='btn btn-link'
                onClick={dismissAll}
            >
                {_('Dismiss all')}
            </button>
        </div>
    </>
}
