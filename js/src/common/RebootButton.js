/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, {useState} from 'react';

import {useAPIGetData} from './APIhooks';
import Button from './bootstrap/Button';
import {APIEndpoints} from './API';

export default function RebootButton({forisFormSize}) {
    const [clicked, setClicked] = useState(false);
    const [triggerReboot] = useAPIGetData(APIEndpoints.reboot);

    return <>
        <Button
            forisFormSize={forisFormSize}
            className={'btn-danger'}
            loading={clicked}
            disabled={clicked}

            onClick={() => {
                const res = confirm(_('Are you sure you want to restart the router?'));
                if (res){
                    setClicked(true);
                    triggerReboot();
                }
            }}
        >
            {_('Reboot')}
        </Button>
    </>
}