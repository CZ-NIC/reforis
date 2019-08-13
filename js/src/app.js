/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {render} from 'react-dom';

import WebSockets from './common/WebSockets';

import Main from './main/Main';

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
import About from './about/About';

import {ForisURLs} from './common/constants';
import Guide from './guide/Guide';

const ws = new WebSockets();

/**
 * This list describes positioning of pages in navigation menu and routing rules.
 * Icons are icon names from font awesome.
 * */
export const ROUTES = [
    {
        name: _('Notifications'),
        path: '/notifications',
        icon: 'bell',
        component: Notifications,
    },
    {
        name: _('Network Settings'),
        path: '/network-settings',
        icon: 'network-wired',
        routes: [
            {
                name: _('Wi-Fi'),
                path: '/wifi',
                component: WiFi
            },
            {
                name: _('WAN'),
                path: '/wan',
                component: WAN
            },
            {
                name: _('LAN'),
                path: '/lan',
                component: LAN
            },
            {
                name: _('DNS'),
                path: '/dns',
                component: DNS
            },
            {
                name: _('Interfaces'),
                path: '/interfaces',
                component: Interfaces
            },
            {
                name: _('Guest Network'),
                path: '/guest-network',
                component: GuestNetwork
            },
        ],
    },
    {
        name: _('Administration'),
        path: '/administration',
        icon: 'user-cog',
        routes: [
            {
                name: _('Password'),
                path: '/password',
                component: Password
            },
            {
                name: _('Region & Time'),
                path: '/region-and-time',
                component: RegionAndTime
            },
            {
                name: _('Notification Settings'),
                path: '/notifications-settings',
                component: NotificationsSettings
            },
            {
                name: _('Reboot'),
                path: '/reboot',
                component: Reboot
            },
        ],
    },
    {
        name: _('Updates'),
        path: '/updates',
        icon: 'sync',
        component: Updates
    },
    {
        name: _('Packages'),
        path: '/packages',
        icon: 'box',
        component: Packages
    },
    {
        name: _('Advanced administration'),
        path: ForisURLs.luci,
        icon: 'cog',
        isLinkOutside: true,
    },
    {
        name: _('About'),
        path: '/about',
        icon: 'info-circle',
        component: About
    }
];

window.addEventListener('load', () => {
    const mainContainer = document.getElementById('app_container');
    if (mainContainer)
        render(<Main ws={ws} routes={ROUTES}/>, mainContainer);

    const guideContainer = document.getElementById('guide_container');
    if (guideContainer)
        render(<Guide ws={ws}/>, guideContainer);

}, false);
