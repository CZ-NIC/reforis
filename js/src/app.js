/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {render} from 'react-dom';

import webSockets from './webSockets';
import NotificationsDropdown from './notifications/NotificationsDropdown/NotificationsDropdown';
import NotificationsCenter from './notifications/NotificationsCenter/NotificationsCenter';

import WiFi from './wifi/WiFi';
import WAN from './wan/WAN';
import LAN from './lan/LAN';
import DNS from './dns/DNS';
import ConnectionTest from './connectionTest/ConnectionTest';

import Administration from './administration/Administration';
import RebootHandler from './forisCommonComponents/Reboot/RebootHandler';
import Updates from './updates/Updates';
import Packages from './packages/Packages';

const ws = new webSockets();

window.addEventListener('load', () => {
    const apps = [
        {id: 'notifications_dropdown_container', component: NotificationsDropdown},
        {id: 'notifications_center_container', component: NotificationsCenter},
        {id: 'wifi_container', component: WiFi},
        {id: 'wan_container', component: WAN},
        {id: 'wan_connection_test_container', component: ConnectionTest},
        {id: 'lan_container', component: LAN},
        {id: 'dns_container', component: DNS},
        {id: 'updates_container', component: Updates},
        {id: 'packages_container', component: Packages},
        {id: 'administration_container', component: Administration},
        {id: 'reboot_handler_container', component: RebootHandler},
    ];

    for (let app of apps) {
        const appElm = document.getElementById(app.id);
        if (!appElm) continue;
        render(<app.component ws={ws}/>, appElm);
    }
}, false);
