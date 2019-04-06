/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import NotificationsDropdownButton from './NotificationsDropdownButton';
import NotificationsDropdownMenu from './NotificationsDropdownMenu';
import useNotifications, {useNewNotification} from './hooks';


export default function NotificationsDropdown() {
    const [notifications, dismiss, dismissAll] = useNotifications();
    const newNotification = useNewNotification();

    return <div id='notifications' className='dropdown btn-group'>
        <NotificationsDropdownButton
            notificationsCount={notifications.length}
            newNotification={newNotification}
        />
        <NotificationsDropdownMenu
            notifications={notifications}

            dismiss={dismiss}
            dismissAll={dismissAll}
        />
    </div>
}
