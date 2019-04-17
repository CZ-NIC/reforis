/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */


import React from 'react';
import propTypes from 'prop-types';

import useNotifications from '../hooks';
import NotificationsCenterList from './NotificationsCenterList';
import NotificationsEmailSettings from './NotificationsEmailSettings/NotificationsEmailSettings';


NotificationsCenter.propTypes = {
    ws: propTypes.object.isRequired
};

export default function NotificationsCenter({ws}) {
    const [notifications, dismiss, dismissAll] = useNotifications(ws);

    function getDismissAllButton() {
        return <button
            type='button'
            id='btn-dismiss-all'
            className='btn btn-outline-danger float-right'
            onClick={dismissAll}
        >
            {_('Dismiss all')}
        </button>
    }

    return <div id='notifications-center'>
        <NotificationsEmailSettings ws={ws}/>

        <h3>{_('Notifications')}</h3>
        {
            notifications.length !== 0 ?
                getDismissAllButton() : <p className='text-muted text-center'>{_('No notifications')}</p>
        }

        <NotificationsCenterList
            notifications={notifications}
            dismiss={dismiss}
        />
    </div>
}
