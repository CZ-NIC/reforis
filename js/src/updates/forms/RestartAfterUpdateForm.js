/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import moment from 'moment';

import NumberInput from '../../common/bootstrap/NumberInput';
import DataTimeInput from '../../common/bootstrap/DataTimeInput';

const TIME_FORMAT = "HH:mm";

const HELP_TEXTS = {
    delay: _('Number of days that must pass between receiving the request for restart and the automatic restart itself.'),
    time: _('Time of day of automatic reboot in HH:MM format.'),
};

RestartAfterUpdateForm.defaultProps = {
    formErrors: {}
};

export default function RestartAfterUpdateForm({formData, formErrors, setFormValue, ...props}) {
    return <>
        <h4>{_('Automatic restarts after software update')}</h4>
        <NumberInput
            label={_('Delay (days)')}
            min={0}
            max={10}
            value={formData.delay}
            error={formErrors.delay}
            helpText={HELP_TEXTS.delay}

            onChange={setFormValue(value => ({reboots: {delay: {$set: value}}}))}

            {...props}
        />
        <DataTimeInput
            label={_('Reboot time')}
            value={moment(formData.time).isValid() ? moment(formData.time) : formData.time}
            error={formErrors.time}
            timeFormat={TIME_FORMAT}
            dateFormat={false}
            helpText={HELP_TEXTS.time}

            onChange={
                value => {
                    if (typeof value === 'string')
                        return setFormValue(
                            value => ({reboots: {time: {$set: value}}})
                        )({target: {value: value}});
                    return setFormValue(
                        value => ({reboots: {time: {$set: value}}})
                    )({target: {value: value.format("HH:mm")}})
                }
            }

            {...props}
        />
    </>
}
