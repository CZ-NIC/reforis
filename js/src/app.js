/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';

import {render} from 'react-dom';
import WiFi from './wifi/Wifi';
import WAN from './wan/WAN';
import LAN from './lan/LAN';
import NotificationsDropdown from './notifications/NotificationsDropdown';
import NotificationsCenter from './notifications/NotificationsCenter';
import ConnectionTest from './connectionTest/ConnectionTest';

window.addEventListener('load', () => {
    const apps = [
        {id: 'notifications_dropdown_container', component: NotificationsDropdown},
        {id: 'notifications_center_container', component: NotificationsCenter},
        {id: 'wifi_container', component: WiFi},
        {id: 'wan_container', component: WAN},
        {id: 'wan_connection_test_container', component: ConnectionTest},
        {id: 'lan_container', component: LAN},
    ];

    for (let app of apps) {
        const appElm = document.getElementById(app.id);
        if (!appElm) continue;
        render(<app.component/>, appElm);
    }
}, false);
