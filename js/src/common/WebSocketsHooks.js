/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import {useEffect, useState} from 'react';

export function useWSForisModule(ws, module, action = 'update_settings') {
    const [data, setData] = useState(null);

    useEffect(() => {
        if(ws && module)
            ws.subscribe(module).bind(module, action, msg => {
                setData(msg.data)
            });
    }, [action, module, ws]);

    return [data]
}
