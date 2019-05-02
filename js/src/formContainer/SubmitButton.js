/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import propTypes from 'prop-types';

import {FORM_STATES} from './hooks';
import Button from '../common/bootstrap/Button';

SubmitButton.propTypes = {
    disabled: propTypes.bool,
    state: propTypes.oneOf(Object.keys(FORM_STATES).map(key => FORM_STATES[key])).isRequired,
    remindsToNWRestart: propTypes.number,
};

export default function SubmitButton({disabled, state, remindsToNWRestart, ...props}) {
    const disableSubmitButton = disabled || state !== FORM_STATES.READY;
    const loadingSubmitButton = state !== FORM_STATES.READY;

    let labelSubmitButton;
    switch (state) {
        case FORM_STATES.UPDATE:
            labelSubmitButton = _('Updating');
            break;
        case FORM_STATES.LOAD:
            labelSubmitButton = _('Load settings');
            break;
        case FORM_STATES.NETWORK_RESTART:
            labelSubmitButton = babel.format(_('Restarting after %d sec.'), remindsToNWRestart || 0);
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
