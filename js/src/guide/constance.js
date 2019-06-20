/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import Password from '../password/Password';
import WorkflowSelect from './WorkflowSelect';
import Interfaces from '../interfaces/Interfaces';
import RegionAndTime from '../regionAndTime/RegionAndTime';
import DNS from '../dns/DNS';
import Updates from '../updates/Updates';
import WAN from '../wan/WAN';
import LAN from '../lan/LAN';
import GuideFinished from './GuideFinish';

export const URL_PREFIX = '/guide';

export const STEPS = {
    password: {
        name: _('Password'),
        component: Password
    },
    profile: {
        name: _('Workflow'),
        component: WorkflowSelect
    },
    networks: {
        name: _('Interfaces'),
        component: Interfaces
    },
    time: {
        name: _('Time'),
        component: RegionAndTime
    },
    dns: {
        name: _('DNS'),
        component: DNS
    },
    updater: {
        name: _('Updates'),
        component: Updates
    },
    wan: {
        name: _('WAN'),
        component: WAN
    },
    lan: {
        name: _('LAN'),
        component: LAN
    },
    finished: {
        name: _('Finish'),
        component: GuideFinished
    }
};
