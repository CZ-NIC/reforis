/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import Overview from 'overview/Overview';

import Notifications from 'notifications/Notifications/Notifications';

import WiFi from 'wifi/WiFi';
import LAN from 'lan/LAN';
import WAN from 'wan/WAN';
import DNS from 'dns/DNS';
import Interfaces from 'interfaces/Interfaces';
import GuestNetwork from 'guestNetwork/GuestNetwork';

import Password from 'password/Password';
import RegionAndTime from 'regionAndTime/RegionAndTime';
import NotificationsSettings from 'notificationsSettings/NotificationsSettings';
import Reboot from 'reboot/Reboot';

import Updates from 'updates/Updates';
import Packages from 'packages/Packages';
import About from 'about/About';

export const PAGES = {
    Overview: Overview,

    Notifications: Notifications,

    LAN: LAN,
    WAN: WAN,
    WiFi: WiFi,
    DNS: DNS,
    Interfaces: Interfaces,
    GuestNetwork: GuestNetwork,

    Password: Password,
    RegionAndTime: RegionAndTime,
    NotificationsSettings: NotificationsSettings,
    Reboot: Reboot,

    Updates: Updates,
    Packages: Packages,
    About: About,
};
