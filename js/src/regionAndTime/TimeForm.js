/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment/moment';

import Select from 'common/bootstrap/Select';
import DataTimeInput from 'common/bootstrap/DataTimeInput';
import {SpinnerElement} from 'common/bootstrap/Spinner';
import Button from 'common/bootstrap/Button';

import useNTPDate from './hooks';

// Foris backend ignore value after "."...
const TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss.0';

const TIME_SETTING_TYPE_CHOICES = {
    ntp: _('Via NTP'),
    manual: _('Manually'),
};

TimeForm.propTypes = {
    ws: PropTypes.object.isRequired,

    formData: PropTypes.shape({
        time_settings: PropTypes.shape({
            how_to_set_time: PropTypes.oneOf(['ntp', 'manual']),
            ntp_servers: PropTypes.arrayOf(PropTypes.string),
            time: PropTypes.oneOfType([
                PropTypes.objectOf(moment),
                PropTypes.string
            ]),
        }).isRequired,
    }).isRequired,

    formErrors: PropTypes.shape({
        time_settings: PropTypes.shape({
            time: PropTypes.string,
        }),
    }).isRequired,

    setFormValue: PropTypes.func.isRequired,
};

TimeForm.defaultProps = {
    formData: {time_settings: {}},
    formErrors: {time_settings: {}},
    setFormValue: () => {
    },
};

export default function TimeForm({ws, formData, formErrors, setFormValue, ...props}) {
    const [ntpData, triggerNTP] = useNTPDate(ws);
    useEffect(() => {
        if (ntpData.data) {
            const time = ntpData.data.time;
            const momentTime = moment(time).isValid() ? moment(time).format(TIME_FORMAT) : time;
            setFormValue(
                value => ({time_settings: {time: {$set: value}}})
            )({target: {value: momentTime}})
        }
    }, [setFormValue, ntpData.data]);

    function updateTimeFromBrowser(e) {
        e.preventDefault();
        setFormValue(value => (
            {time_settings: {time: {$set: value}}})
        )({target: {value: moment()}})
    }

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

            disabled={data.how_to_set_time !== 'manual' || ntpData.isLoading}
        >
            <div className="input-group-append">
                <button
                    className="input-group-text"
                    onClick={data.how_to_set_time === 'ntp' ? triggerNTP : updateTimeFromBrowser}
                    disabled={ntpData.isLoading}
                >
                    {ntpData.isLoading ? <SpinnerElement small/> : <i className="fa fa-sync-alt"/>}
                </button>
            </div>
        </DataTimeInput>
    </>
}

NTPServersList.propTypes = {
    servers: PropTypes.arrayOf(PropTypes.string).isRequired
};

function NTPServersList({servers}) {
    const [shown, setShown] = useState(false);
    return <>
        <Button
            className="btn-outline-primary"
            forisFormSize
            data-toggle="collapse"
            href="#collapseNTPServers"
            onClick={e => {
                e.preventDefault();
                setShown(!shown)
            }}
        >
            {shown ? _('Hide NTP servers list') : _('Show NTP servers list')}
        </Button>

        <div className="collapse" id="collapseNTPServers">
            <h5>{_('NTP servers')}</h5>
            <div id="ntpServersList">
                {servers.map(server => <p key={server}>{server}</p>)}
            </div>
        </div>
    </>
}
