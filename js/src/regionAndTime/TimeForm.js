/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, {useEffect} from 'react';
import propTypes from 'prop-types';
import moment from 'moment/moment';

import Select from '../common/bootstrap/Select';
import DataTimeInput from '../common/bootstrap/DataTimeInput';
import {useAPIGet} from '../common/APIhooks';
import API_URLs from '../common/API';

// Foris backend ignore value after "."...
const TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss.0';

const TIME_SETTING_TYPE_CHOICES = {
    ntp: _('Via ntp'),
    manual: _('Manually'),
};

TimeForm.propTypes = {
    formData: propTypes.shape({
        time_settings: propTypes.shape({
            how_to_set_time: propTypes.oneOf(['ntp', 'manual']),
            ntp_servers: propTypes.arrayOf(propTypes.string),
            time: propTypes.oneOfType([
                propTypes.objectOf(moment),
                propTypes.string
            ]),
        }).isRequired,
    }).isRequired,

    formErrors: propTypes.shape({
        time_settings: propTypes.shape({
            time: propTypes.string,
        }),
    }).isRequired,

    setFormValue: propTypes.func.isRequired,
};

TimeForm.defaultProps = {
    formData: {time_settings: {}},
    formErrors: {time_settings: {}},
    setFormValue: () => {
    },
};

export default function TimeForm({formData, formErrors, setFormValue, ...props}) {
    const [updateTimeState, updateTime] = useAPIGet(API_URLs.time);
    useEffect(() => {
        if (updateTimeState.data) {
            const time = updateTimeState.data.time;
            const momentumTime = moment(time).isValid() ? moment(time).format(TIME_FORMAT) : time;
            setFormValue(
                value => ({time_settings: {time: {$set: value}}})
            )({target: {value: momentumTime}})
        }
    }, [setFormValue, updateTimeState.data]);

    const data = formData.time_settings;
    const errors = formErrors.time_settings || {};

    function onDataTimeChangeHandler(value) {
        // Dirty hack to get DataTime library work
        if (typeof value === 'string')
            return setFormValue(
                value => ({time_settings: {time: {$set: value}}})
            )({target: {value: value}});
        return setFormValue(
            value => ({time_settings: {time: {$set: value}}})
        )({target: {value: value.format(TIME_FORMAT)}})
    }

    return <>
        <h4>{_('Time settings')}</h4>
        <p>{_('Time should be up-to-date otherwise DNS and other services might not work properly.')}</p>
        <Select
            label={_('How to set time')}
            choices={TIME_SETTING_TYPE_CHOICES}
            value={data.how_to_set_time}

            onChange={setFormValue(
                value => ({time_settings: {how_to_set_time: {$set: value}}})
            )}

            {...props}
        />
        {data.how_to_set_time === 'ntp' ? <NTPServersList servers={data.ntp_servers}/> : null}
        <DataTimeInput
            label={_('Time')}
            value={moment(data.time).isValid() ? moment(data.time) : data.time}
            error={errors.time}

            onChange={onDataTimeChangeHandler}

            {...props}

            disabled={data.how_to_set_time !== 'manual' || updateTimeState.isLoading}
        >
            <div className="input-group-append">
                <button className="input-group-text" onClick={updateTime}>
                    <i className="fa fa-sync-alt"/>
                </button>
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
