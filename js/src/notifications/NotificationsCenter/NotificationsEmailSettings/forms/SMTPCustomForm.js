/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import propTypes from 'prop-types';

import Select from '../../../../bootstrap/Select';
import TextInput from '../../../../bootstrap/TextInput';
import NumberInput from '../../../../bootstrap/NumberInput';
import PasswordInput from '../../../../bootstrap/PasswordInput';
import EmailInput from '../../../../bootstrap/EmailInput';

import HELP_TEXTS from '../helpTexts';

const SECURITY_CHOICES = {
    none: _('None'),
    ssl: _('SSL'),
    starttls: _('STARTTLS'),
};

SMTPCustomForm.propTypes = {
    formData: propTypes.shape({
        from: propTypes.string,
        host: propTypes.string,
        port: propTypes.number,
        security: propTypes.oneOf(['none', 'ssl', 'starttls']),
        username: propTypes.string,
        password: propTypes.string,
    }).isRequired,
    formErrors: propTypes.shape({
        from: propTypes.string,
        host: propTypes.string,
        port: propTypes.string,
        username: propTypes.string,
        password: propTypes.string,
    }),
    setFormValue: propTypes.func.isRequired,
};

SMTPCustomForm.defaultProps = {
    setFormValue: () => {
    },
    formData: {},
    formErrors: {},
};

export default function SMTPCustomForm({formData, formErrors, setFormValue, ...props}) {
    return <>
        <h4>{_('SMTP settings')}</h4>
        <EmailInput
            label={_('Sender address (From)')}
            value={formData.from || ''}
            error={formErrors.from}
            helpText={HELP_TEXTS.smtp_custom.from}
            placeholder="router@example.com"
            required

            onChange={setFormValue(value => ({smtp_custom: {from: {$set: value}}}))}

            {...props}
        />
        <TextInput
            label={_('Server address')}
            value={formData.host || ''}
            error={formErrors.host}
            placeholder="example.com"
            required

            onChange={setFormValue(value => ({smtp_custom: {host: {$set: value}}}))}

            {...props}
        />
        <NumberInput
            label={_('Server port')}
            value={formData.port}
            error={formErrors.port}
            min={1}
            max={65535}

            onChange={setFormValue(value => ({smtp_custom: {port: {$set: value}}}))}

            {...props}
        />
        <Select
            label={_('Security')}
            value={formData.security}
            choices={SECURITY_CHOICES}

            onChange={setFormValue(value => ({smtp_custom: {security: {$set: value}}}))}

            {...props}
        />
        <TextInput
            label={_('User')}
            value={formData.user || ''}

            onChange={setFormValue(value => ({smtp_custom: {user: {$set: value}}}))}

            {...props}
        />
        <PasswordInput
            label={_('Password')}
            value={formData.password || ''}

            onChange={setFormValue(value => ({smtp_custom: {password: {$set: value}}}))}

            {...props}
        />

    </>
}