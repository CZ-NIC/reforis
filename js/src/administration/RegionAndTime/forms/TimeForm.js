/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import propTypes from 'prop-types';

import Select from '../../../bootstrap/Select';
import DataTimeInput from '../../../bootstrap/DataTimeInput';
import moment from 'moment';

TimeForm.propTypes = {
    formData: propTypes.shape({
        how_to_set_time: propTypes.oneOf(['ntp', 'manual']),
        ntp_servers: propTypes.arrayOf(propTypes.string),
        time: propTypes.string,
    }).isRequired,
    formErrors: propTypes.shape({
        time: propTypes.string,
    }).isRequired,
    setFormValue: propTypes.func.isRequired,
};

TimeForm.defaultProps = {
    formErrors: {}
};

const TIME_SETTING_TYPE_CHOICES = {
    ntp: _('Via ntp'),
    manual: _('Manually'),
};

export default function TimeForm({formData, formErrors, setFormValue, updateTime, ...props}) {
    return <>
        <h4>{_('Time settings')}</h4>
        <p>{_('Time should be up-to-date otherwise DNS and other services might not work properly.')}</p>
        <Select
            label={_('How to set time')}
            choices={TIME_SETTING_TYPE_CHOICES}
            value={formData.how_to_set_time}

            onChange={setFormValue(
                value => ({time_settings: {how_to_set_time: {$set: value}}})
            )}

            {...props}
        />
        {formData.how_to_set_time === 'ntp' ? <NTPServersList servers={formData.ntp_servers}/> : null}
        <DataTimeInput
            label={_('Time')}
            value={moment(formData.time).isValid() ? moment(formData.time) : formData.time}
            error={formErrors.time}

            onChange={
                value => {
                    if (typeof value === 'string')
                        return setFormValue(
                            value => ({time_settings: {time: {$set: value}}})
                        )({target: {value: value}});
                    return setFormValue(
                        value => ({time_settings: {time: {$set: value}}})
                        // Foris backend ignore value after "."...
                    )({target: {value: value.format("YYYY-MM-DDTHH:mm:ss.0")}})
                }
            }
            {...props}
            disabled={formData.how_to_set_time === 'ntp'}
        >
            <div className="input-group-append">
                <a className="input-group-text" onClick={updateTime}>
                    <i className="fa fa-sync-alt"/>
                </a>
            </div>
        </DataTimeInput>
    </>
}

NTPServersList.propTypes = {
    servers: propTypes.arrayOf(propTypes.string).isRequired
};

function NTPServersList({servers}) {
    return <table className='table table-borderless table-hover offset-lg-3 col-lg-6 col-sm-12'>
        <thead>
        <tr>
            <th>{_('NTP servers')}</th>
        </tr>
        </thead>
        <tbody>
        {servers.map(server =>
            <tr key={server}>
                <td>{server}</td>
            </tr>
        )}
        </tbody>
    </table>
}
