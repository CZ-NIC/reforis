/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import propTypes from 'prop-types';

import Button from 'common/bootstrap/Button';

export const STATES = {
    READY: 1,
    SAVING: 2,
    LOAD: 3,
};

SubmitButton.propTypes = {
    disabled: propTypes.bool,
    state: propTypes.oneOf(Object.keys(STATES).map(key => STATES[key])),
    remindsToNWRestart: propTypes.number,
};

export default function SubmitButton({disabled, state, remindsToNWRestart, ...props}) {
    const disableSubmitButton = disabled || state !== STATES.READY;
    const loadingSubmitButton = state !== STATES.READY;

    let labelSubmitButton;
    switch (state) {
        case STATES.SAVING:
            labelSubmitButton = _('Updating');
            break;
        case STATES.LOAD:
            labelSubmitButton = _('Load settings');
            break;
        default:
            labelSubmitButton = _('Save');
    }

    return <Button
        loading={loadingSubmitButton}
        disabled={disableSubmitButton}
        forisFormSize

        {...props}
    >
        {labelSubmitButton}
    </Button>;
}
