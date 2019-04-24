/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';

import useRebootHandling, {REBOOT_STATES} from './hooks';


export default function RebootHandler({ws}) {
    const [rebootState, remains] = useRebootHandling(ws);

    if (rebootState === REBOOT_STATES.NOT_TRIGGERED)
        return null;

    return <Spinner state={rebootState} remains={remains}/>
}

function Spinner({state, remains}) {
    return <div className="spinner-wrapper">
        <div className="spinner-background">
            <div className="spinner-text">
                {state === REBOOT_STATES.TRIGGERED ?
                    <h3>{babel.format(_('Reboot after %d sec.'), remains || 0)}</h3> :
                    state === REBOOT_STATES.IN_PROCESS ?
                        <h3>{_('Rebooting...')}</h3> :
                        state === REBOOT_STATES.DONE ?
                            <h3>{_('Reconnecting...')}</h3>
                            : null}
            </div>
            <div className="spinner-border" role="status">
                <span className="sr-only"/>
            </div>
        </div>
    </div>;
}