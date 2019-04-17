/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import propTypes from 'prop-types';

import CheckBox from '../../../../bootstrap/Checkbox';
import RadioSet from '../../../../bootstrap/RadioSet';

import HELP_TEXTS from '../helpTexts';
import CommonForm from './CommonForm';
import SMTPTurrisForm from './SMTPTurrisForm';
import SMTPCustomForm from './SMTPCustomForm';

const SMTP_TYPE_CHOICES = [
    {label: _('Turris'), value: 'turris'},
    {label: _('Custom'), value: 'custom'}
];

NotificationsEmailSettingsForm.propTypes = {
    formData: propTypes.oneOfType(
        [
            propTypes.shape({}),
            propTypes.shape({
                emails: propTypes.shape({
                    enabled: propTypes.bool.isRequired,
                    smtp_type: propTypes.oneOf(['turris', 'custom']),
                    common: propTypes.object,
                    smtp_turris: propTypes.object,
                    smtp_custom: propTypes.object,
                })
            })
        ]
    ).isRequired,
    formErrors: propTypes.shape({}),
    setFormValue: propTypes.func.isRequired,
};

NotificationsEmailSettingsForm.defaultProps = {
    setFormValue: () => {
    },
    formData: {},
    formErrors: {},
};


export default function NotificationsEmailSettingsForm({formData, formErrors, setFormValue, ...props}) {
    return <>
        <CheckBox
            label={_('Enable email notifications')}
            checked={formData.enabled}
            helpText={HELP_TEXTS.smtp_type}
            onChange={setFormValue(
                value => ({enabled: {$set: value}})
            )}

            {...props}
        />
        {formData.enabled ?
            <>
                <RadioSet
                    label={_('SMTP provider')}
                    name={'smtp_provider'}
                    choices={SMTP_TYPE_CHOICES}
                    value={formData.smtp_type}

                    onChange={setFormValue(
                        value => ({smtp_type: {$set: value}})
                    )}

                    {...props}
                />
                <CommonForm
                    formData={formData.common}
                    formErrors={formErrors.common}
                    setFormValue={setFormValue}

                    {...props}
                />
                {
                    formData.smtp_type === 'turris' ?
                        <SMTPTurrisForm
                            formData={formData.smtp_turris}
                            formErrors={formErrors.smtp_turris}
                            setFormValue={setFormValue}

                            {...props}
                        /> :
                        formData.smtp_type === 'custom' ?
                            <SMTPCustomForm
                                formData={formData.smtp_custom}
                                formErrors={formErrors.smtp_custom}
                                setFormValue={setFormValue}

                                {...props}
                            /> : null
                }
            </>
            : null}
    </>
}
