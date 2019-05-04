/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import propTypes from 'prop-types';

import TextInput from '../../common/bootstrap/TextInput';
import Select from '../../common/bootstrap/Select';
import CheckBox from '../../common/bootstrap/Checkbox';

import HELP_TEXTS from '../helpTexts';

export const SEVERITY_OPTIONS = {
    // '0': _?,
    '1': _("Reboot is required"),
    '2': _("Reboot or attention is required"),
    '3': _("Reboot or attention is required or update was installed"),
};

CommonForm.propTypes = {
    formData: propTypes.shape({
        to: propTypes.string,
        severity_filter: propTypes.oneOf(
            Object.keys(SEVERITY_OPTIONS).map(key => parseInt(key))
        ).isRequired,
        send_news: propTypes.bool.isRequired
    }).isRequired,
    formErrors: propTypes.shape({to: propTypes.string,}),
    setFormValue: propTypes.func.isRequired,
};

CommonForm.defaultProps = {
    setFormValue: () => {
    },
    formData: {},
    formErrors: {},
};

export default function CommonForm({formData, formErrors, setFormValue, ...props}) {
    return <>
        <TextInput
            label={_("Recipient's email")}
            value={formData.to || ''}
            error={formErrors.to}
            helpText={HELP_TEXTS.common.to}
            required

            onChange={setFormValue(value => ({common: {to: {$set: value}}}))}

            {...props}
        />
        <Select
            label={_('Importance')}
            value={formData.severity_filter}
            choices={SEVERITY_OPTIONS}

            onChange={setFormValue(value => ({common: {severity_filter: {$set: value}}}))}

            {...props}
        />
        <CheckBox
            label={_('Send news')}
            checked={formData.send_news}
            helpText={HELP_TEXTS.common.send_news}

            onChange={setFormValue(value => ({common: {send_news: {$set: value}}}))}

            {...props}
        />
    </>
}
