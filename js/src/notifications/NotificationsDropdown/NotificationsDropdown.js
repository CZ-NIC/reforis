/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import propTypes from 'prop-types';
import ReactDOM from 'react-dom';

import NotificationsDropdownButton from './NotificationsDropdownButton';
import NotificationsDropdownMenu from './NotificationsDropdownMenu';
import useNotifications, {useNewNotification} from '../hooks';


NotificationsDropdown.propTypes = {
    ws: propTypes.object.isRequired
};

export default function NotificationsDropdown({ws}) {
    const [notifications, dismiss, dismissAll] = useNotifications(ws);
    const newNotification = useNewNotification(ws);
    const container = document.getElementById('notifications_dropdown_container');
    return ReactDOM.createPortal(
        <div id='notifications' className='dropdown btn-group'>
            <NotificationsDropdownButton
                notificationsCount={notifications.length}
                newNotification={newNotification}
            />
            <NotificationsDropdownMenu
                notifications={notifications}

                dismiss={dismiss}
                dismissAll={dismissAll}
            />
        </div>,
        container,
    );
}
