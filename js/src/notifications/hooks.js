/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import { useEffect, useState } from "react";

import API_URLs from "common/API";
import {
    useWSForisModule, useAPIGet, useAPIPost, API_STATE,
} from "foris";

const WS_MODULE = "router_notifications";

export default function useNotifications(ws) {
    const [notifications, setNotifications] = useState([]);
    const [getState, get] = useAPIGet(API_URLs.notifications);

    useEffect(() => {
        get();
    }, [get]);
    useEffect(() => {
        if (getState.state === API_STATE.SUCCESS) {
            const nonDisplayedNotifications = getState.data.notifications
                .filter((notification) => !notification.displayed);
            setNotifications(nonDisplayedNotifications);
        }
    }, [getState]);

    // Reload notifications when a new one is created
    const [WSCreateData] = useWSForisModule(ws, WS_MODULE, "create");
    useEffect(() => {
        if (WSCreateData) {
            get();
        }
    }, [WSCreateData, get]);

    // Mark as displayed
    const [WSMarkAsDisplayedData] = useWSForisModule(ws, WS_MODULE, "mark_as_displayed");
    useEffect(() => {
        if (!WSMarkAsDisplayedData) {
            return;
        }
        if (WSMarkAsDisplayedData.new_count === 0) {
            setNotifications([]);
        } else if (WSMarkAsDisplayedData.ids.length === 1) {
            setNotifications((currentNotifications) => currentNotifications.filter(
                (notification) => notification.id !== WSMarkAsDisplayedData.ids[0],
            ));
        }
    }, [WSMarkAsDisplayedData, setNotifications]);

    const [, post] = useAPIPost(API_URLs.notifications);

    function dismiss(notificationId) {
        post({ ids: [notificationId] });
        setNotifications((currentNotifications) => currentNotifications.filter(
            (notification) => notification.id !== notificationId,
        ));
    }

    function dismissAll() {
        post({ ids: notifications.map((notification) => notification.id) });
        setNotifications([]);
    }

    return [notifications, dismiss, dismissAll];
}

const NEW_NOTIFICATION_ANIMATION_DURATION = 1; // Sec.

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

    const [WSCreateData] = useWSForisModule(ws, WS_MODULE, "create");

    useEffect(() => {
        if (WSCreateData) setNewNotification(true);
    }, [WSCreateData]);

    return newNotification;
}
