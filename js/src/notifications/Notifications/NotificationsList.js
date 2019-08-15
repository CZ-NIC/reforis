/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';

import {NOTIFICATION_PROP_TYPES, toLocaleDateString} from '../utils';
import NotificationIcon from '../NotificationIcon';
import RebootButton from 'common/RebootButton';


NotificationsList.propTypes = {
    notifications: PropTypes.arrayOf(NOTIFICATION_PROP_TYPES),
    dismiss: PropTypes.func.isRequired
};

export default function NotificationsList({notifications, dismiss, currentNotification}) {
    return notifications.map(
        notification => {
            return <NotificationsCenterItem
                key={notification.id}
                notification={notification}
                currentNotification={currentNotification}
                dismiss={() => dismiss(notification.id)}
            />
        }
    )
}

const BORDER_TYPES = {
    news: 'border-info',
    update: 'border-info',
    restart: 'border-danger',
    error: 'border-danger',
};

function NotificationsCenterItem({notification, currentNotification, dismiss}) {
    const myRef = useRef(null);

    function getIDFromURL() {
        const searchParams = new URLSearchParams(window.location.search);
        return searchParams.get('id') || null;
    }

    useEffect(() => {
        if (
            getIDFromURL() === notification.id ||
            (currentNotification && currentNotification.endsWith(notification.id))
        )
            myRef.current.scrollIntoView({block: 'start', behavior: 'smooth'});
    }, [notification.id, currentNotification]);

    return <div ref={myRef} className={`card bg-light ${BORDER_TYPES[notification.severity]} sm-10`}>
        <div className='card-header'>
            <NotificationIcon severity={notification.severity} className={'fa-2x'}/>
            <p className='text-muted'>{toLocaleDateString(notification.created_at)}</p>
            <button type='button' className='close' onClick={dismiss}>×</button>
        </div>

        <div className='card-body'>
            <p className='card-text'>{notification.msg}</p>
        </div>
        {notification.severity === 'restart' ? <RebootButton/> : null}
    </div>;
}
