/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';

import {STATES, useNetworkRestart} from './hooks';
import Spinner from '../common/bootstrap/Spinner';

export default function NetworkRestartHandler({ws}) {
    const [rebootState, remains] = useNetworkRestart(ws);

    if (rebootState === STATES.NOT_TRIGGERED)
        return null;

    let message;
    switch (rebootState) {
        case STATES.TRIGGERED:
            message = babel.format(_('Network restart after %d sec.'), remains || 0);
            break;
        case STATES.IN_PROCESS:
            message = _('Network restarting');
            break;
        case STATES.DONE:
            message = _('Reconnecting');
            break;
        default:
    }

    return <Spinner fullScreen={true}>
        <h3>{message}</h3>
    </Spinner>
}