/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, {useState, useEffect} from 'react';

import {useAPIGetData, useAPIPostData} from '../common/APIhooks';
import {APIEndpoints} from '../common/API';

export default function useNotifications(ws) {
    const [notifications, setNotifications] = useState([]);
    const [getData] = useAPIGetData(APIEndpoints.notifications);
    const postData = useAPIPostData(APIEndpoints.notifications);

    useEffect(() => {
        getNotifications();
        const wsModule = 'router_notifications';
        ws.subscribe(wsModule)
            .bind(wsModule, 'create', () => getNotifications())
            .bind(wsModule, 'mark_as_displayed', () => getNotifications());
    }, []);

    function getNotifications() {
        getData(data => {
            const nonDisplayedNotifications = data.notifications.filter(
                notification => !notification.displayed
            );
            setNotifications(nonDisplayedNotifications)
        })
    }

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

export function useNewNotification(ws) {
    const [newNotification, setNewNotification] = useState(false);
    useEffect(() => {
        if (newNotification) {
            setTimeout(
                () => setNewNotification(false),
                NEW_NOTIFICATION_ANIMATION_DURATION * 1000,
            );
        }
    }, [newNotification]);
    useEffect(() => {
        const wsModule = 'router_notifications';
        ws.subscribe(wsModule)
            .bind(wsModule, 'create', () => setNewNotification(true))
    }, []);

    return newNotification
}