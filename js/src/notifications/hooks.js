/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, {useState, useEffect} from 'react';
import {useWS} from '../webSockets/hooks';
import {useAPIGetData, useAPIPostData} from '../api/hooks';

export default function useNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [getData, isReady] = useAPIGetData('notifications');
    const postData = useAPIPostData('notifications');

    function getNotifications() {
        getData(data => {
            const nonDisplayedNotifications = data.notifications.filter(
                notification => !notification.displayed
            );
            setNotifications(nonDisplayedNotifications)
        })
    }

    useEffect(() => getNotifications(), []);
    useWS('router_notifications', 'create', () => getNotifications());
    useWS('router_notifications', 'mark_as_displayed', () => getNotifications());

    function dismissNotification(notificationId) {
        postData({ids: [notificationId,]});
        setNotifications(notifications => notifications.filter(
            notification => notification.id !== notificationId
        ));
    }

    function dismissAll() {
        postData({ids: notifications.map(notification => notification.id)});
        setNotifications([]);
    }

    return [notifications, dismissNotification, dismissAll]
}

const NEW_NOTIFICATION_ANIMATION_DURATION = 1;

export function useNewNotification() {
    const [newNotification, setNewNotification] = useState(false);
    useEffect(() => {
        if (newNotification) {
            setTimeout(
                () => setNewNotification(false),
                NEW_NOTIFICATION_ANIMATION_DURATION * 1000,
            );
        }
    }, [newNotification]);

    useWS('router_notifications', 'create', () => {
        setNewNotification(true);
    });


    return newNotification
}