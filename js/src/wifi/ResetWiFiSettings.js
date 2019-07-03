/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, {useEffect, useState} from 'react';

import Button from '../common/bootstrap/Button';
import {useAPIGet} from '../common/APIhooks';
import API from '../common/API';
import Alert from '../common/bootstrap/Alert';

export default function ResetWiFiSettings({ws}) {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const module = 'wifi';
        ws.subscribe(module)
            .bind(module, 'reset', () => {
                setIsLoading(true);
                // eslint-disable-next-line no-restricted-globals
                setTimeout(() => location.reload(), 1000);
            })
    }, [ws]);

    const [data, trigger] = useAPIGet(API.wifiReset);
    const [alert, setAlert] = useState(false);
    useEffect(() => {
        if (data.data)
            setAlert(true)
    }, [data, setAlert]);

    function resetWiFiSettingsHandler(e) {
        e.preventDefault();
        trigger();
    }

    return <>
        <form onSubmit={resetWiFiSettingsHandler}>
            <h4>{_('Reset Wi-Fi Settings')}</h4>
            {alert ? <ResetWiFiDoneAlert fail={data.isError} onDismiss={() => setAlert(false)}/> : null}
            <p>{_(`
If a number of wireless cards doesn't match, you may try to reset the Wi-Fi settings. Note that this will remove the
current Wi-Fi configuration and restore the default values.
        `)}</p>
            <Button
                className="btn-warning"
                forisFormSize
                loading={isLoading}
                disabled={isLoading}

                onClick={resetWiFiSettingsHandler}
            >
                {_('Reset Wi-Fi Settings')}
            </Button>
        </form>
    </>
}

function ResetWiFiDoneAlert({fail, onDismiss}) {
    const props = fail ? {
        message: _('Wi-Fi reset was failed.'),
        type: 'danger',
    } : {
        message: _('Wi-Fi reset was successful.'),
        type: 'success',
    };

    return <Alert {...props} onDismiss={onDismiss}/>;
}
