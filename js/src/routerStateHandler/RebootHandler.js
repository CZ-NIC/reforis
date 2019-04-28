/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';

import Spinner from '../common/Spinner';
import {STATES, useReboot} from './hooks';

export default function RebootHandler({ws}) {
    const [rebootState, remains] = useReboot(ws);

    if (rebootState === STATES.NOT_TRIGGERED)
        return null;

    let message;
    switch (rebootState) {
        case STATES.TRIGGERED:
            message = babel.format(_('Reboot after %d sec.'), remains || 0);
            break;
        case STATES.IN_PROCESS:
            message = _('Rebooting');
            break;
        case STATES.DONE:
            message = _('Reconnecting');
            break;
    }

    return <Spinner>
        <h3>{message}</h3>
    </Spinner>
}