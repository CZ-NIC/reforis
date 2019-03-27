/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import {Button} from "../bootstrap/Button";
import {STATES} from "./Wrappers";

export default function SettingsSubmitButton({disable, state, remindsToNWRestart}) {
    const disableSubmitButton = disable || state !== STATES.READY;
    const loadingSubmitButton = state !== STATES.READY;

    let labelSubmitButton;
    switch (state) {
        case STATES.UPDATE:
            labelSubmitButton = _('Updating');
            break;
        case STATES.LOAD:
            labelSubmitButton = _('Load settings');
            break;
        case STATES.NETWORK_RESTART:
            labelSubmitButton = babel.format(_('Restarting after %d sec.'), remindsToNWRestart);
            break;
        default:
            labelSubmitButton = _('Save');
    }

    return <Button
        id='wifi-submit-button'
        className='btn-primary'
        loading={loadingSubmitButton}
        disabled={disableSubmitButton}
    >
        {labelSubmitButton}
    </Button>;
}