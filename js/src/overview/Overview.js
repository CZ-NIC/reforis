/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';

import UpdateApprovals from './UpdatesApprovals';
import RebootIsRequiredAlert from './RebootIsRequiredAlert';

export default function Overview({ws}) {
    return <>
        <RebootIsRequiredAlert ws={ws}/>
        <UpdateApprovals/>
    </>
}
