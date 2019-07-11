/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';

import RebootButton from '../common/RebootButton';

export default function Reboot() {
    return <>
        <h1>{_('Device reboot')}</h1>
        <p>{_(`
If you need to reboot the device, click on the following button. The reboot process takes approximately 30 seconds, you
will be required to log in again after the reboot.
    `)}
        </p>
        <RebootButton forisFormSize/>
    </>
}
