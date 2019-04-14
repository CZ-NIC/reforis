/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, {useRef, useEffect} from 'react';
import propTypes from 'prop-types';

import {NOTIFICATION_PROP_TYPES, toLocaleDateString} from './utils';
import NotificationIcon from './NotificationIcon';

NotificationsCenterList.propTypes = {
    notifications: propTypes.arrayOf(NOTIFICATION_PROP_TYPES),
    dismiss: propTypes.func.isRequired
};

export default function NotificationsCenterList({notifications, dismiss}) {
    return notifications.map(
        notification => {
            return <NotificationsCenterItem
                key={notification.id}
                notification={notification}
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

function NotificationsCenterItem({notification, dismiss}) {
    const myRef = useRef(null);

    function getIDFromURL() {
        const searchParams = new URLSearchParams(window.location.search);
        return searchParams.get('id') || null;
    }

    useEffect(() => {
        if (getIDFromURL() === notification.id)
            myRef.current.scrollIntoView({block: 'start', behavior: 'smooth'});
    }, []);


    return <div ref={myRef} className={`card bg-light ${BORDER_TYPES[notification.severity]} sm-10`}>
        <div className='card-header'>
            <NotificationIcon severity={notification.severity} className={'fa-2x'}/>
            <p className='text-muted'>{toLocaleDateString(notification.created_at)}</p>
            <button
                type='button'
                className='close'
                onClick={dismiss}
            >×
            </button>
        </div>

        <div className='card-body'>
            <p className='card-text'>{notification.msg}</p>
        </div>
    </div>;
}
