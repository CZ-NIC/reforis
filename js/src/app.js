/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {render} from 'react-dom';

import WebSockets from './common/WebSockets';

import Overview from './overview/Overview';
import RouterStateHandler from './routerStateHandler/RouterStateHandler';

import NotificationsDropdown from './notifications/NotificationsDropdown/NotificationsDropdown';
import Notifications from './notifications/Notifications/Notifications';

import WiFi from './wifi/WiFi';
import WAN from './wan/WAN';
import LAN from './lan/LAN';
import DNS from './dns/DNS';
import Interfaces from './interfaces/Interfaces';
import GuestNetwork from './guestNetwork/GuestNetwork';

import Password from './password/Password';
import RegionAndTime from './regionAndTime/RegionAndTime';
import NotificationsSettings from './notificationsSettings/NotificationsSettings';
import Reboot from './reboot/Reboot';

import Updates from './updates/Updates';
import Packages from './packages/Packages';

const ws = new WebSockets();

window.addEventListener('load', () => {
    const apps = [
        // Network settings
        {id: 'wifi_container', component: WiFi},
        {id: 'wan_container', component: WAN},
        {id: 'lan_container', component: LAN},
        {id: 'dns_container', component: DNS},
        {id: 'interfaces_container', component: Interfaces},
        {id: 'guest_network_container', component: GuestNetwork},

        // Administration
        {id: 'password_container', component: Password},
        {id: 'region_and_time_container', component: RegionAndTime},
        {id: 'notifications_settings_container', component: NotificationsSettings},
        {id: 'reboot_container', component: Reboot},

        // Updater
        {id: 'updates_container', component: Updates},
        {id: 'packages_container', component: Packages},

        {id: 'router_state_handler_container', component: RouterStateHandler},

        {id: 'notifications_dropdown_container', component: NotificationsDropdown},
        {id: 'notifications_container', component: Notifications},

        {id: 'overview_container', component: Overview},
    ];

    for (let app of apps) {
        const appElm = document.getElementById(app.id);
        if (!appElm) continue;
        render(<app.component ws={ws}/>, appElm);
    }
}, false);
