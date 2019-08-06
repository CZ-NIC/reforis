/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';


import useNotifications from '../notifications/hooks';
import RebootButton from '../common/RebootButton';

export default function RebootIsRequiredAlert({ws}) {
    const [notifications,] = useNotifications(ws);
    const rebootIsRequired = notifications.some(notification => notification.severity === 'restart');
    if (!rebootIsRequired)
        return null;

    return <div className="card sm-col-10 lg-col-10 border-danger" style={{margin: "0 0 1rem"}}>
        <div className='card-body'>
            <h5 style={{textAlign: 'center'}}>{_('Reboot is required.')}</h5>
        </div>
        <RebootButton/>
    </div>;
}
