/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import Button from '../bootstrap/Button';
import {TEST_STATES} from "./ConnectionTest";

export default function ConnectionTestButton({state, ...props}) {
    const isRunning = state === TEST_STATES.RUNNING;
    let labelSubmitButton;
    switch (state) {
        case TEST_STATES.RUNNING:
            labelSubmitButton = _('Test is running...');
            break;
        case TEST_STATES.FINISHED:
            labelSubmitButton = _('Test connection again');
            break;
        default:
            labelSubmitButton = _('Test connection');
    }

    return <Button
        className='btn-primary'
        loading={isRunning}
        disabled={isRunning}

        {...props}
    >
        {labelSubmitButton}
    </Button>;
}