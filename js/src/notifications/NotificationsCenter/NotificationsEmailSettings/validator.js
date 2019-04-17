/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */


import {validateMultipleEmails} from '../../../forisForm/validation';

export default function validator(formData) {
    let errors = {};
    if (!formData.enabled)
        return undefined;

    errors.common = commonValidator(formData.common);
    if (formData.smtp_type === 'turris')
        errors.smtp_turris = smtpTurrisValidator(formData.smtp_turris);
    else if (formData.smtp_type === 'custom')
        errors.smtp_custom = smtpCustomValidator(formData.smtp_custom);
    return JSON.stringify(errors) !== '{}' ? errors : undefined;
}


function commonValidator(formData) {
    if (formData.to === '')
        return {to: _('Can\'t be empty.')};

    const toError = validateMultipleEmails(formData.to);
    return toError ? {to: toError} : undefined
}


const SENDER_NAME_RE = /^[0-9a-zA-Z_\\.-]+$/;

function smtpTurrisValidator(formData) {
    if (formData.sender_name === '')
        return {sender_name: _('Sender\'s name can\'t be empty.')};

    return !SENDER_NAME_RE.test(formData.sender_name) ?
        {sender_name: _("Sender's name can contain only alphanumeric characters, dots and underscores.")}
        : undefined
}

function smtpCustomValidator(formData) {
    if (isNaN(parseInt(formData.port)))
        return {port: _('Port is an number.')};
    if (formData.port > 65535)
        return {port: _('Maximum port is 65535.')};
    if (formData.port < 1)
        return {port: _('Minimum port is 1.')};
    return undefined
}
