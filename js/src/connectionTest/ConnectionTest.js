/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, {useState} from 'react';
import ConnectionTestButton from './ConnectionTestButton';
import {useAPIGetData} from '../forisAPI/hooks';
import {useWS} from '../webSockets/hooks';

export const TEST_STATES = {
    NOT_RUNNING: 0,
    RUNNING: 1,
    FINISHED: 2,
};

export default function ConnectionTest() {
    const [state, setState] = useState(TEST_STATES.NOT_RUNNING);
    const initialResults = {
        ipv6: null,
        ipv6_gateway: null,
        ipv4: null,
        ipv4_gateway: null,
    };
    const [testResults, setTestResults] = useState(initialResults);
    const [, setTestID] = useState(null);
    const [getData] = useAPIGetData('connectionTest');

    useWS('wan', 'connection_test', msg => {
        setTestResults(prevTestResults => ({
            ...prevTestResults,
            ...msg.data.data
        }));
    });
    useWS('wan', 'connection_test_finished', msg => {
        setTestResults(msg.data.data);
        setState(TEST_STATES.FINISHED);
    });

    function onSubmit(e) {
        e.preventDefault();
        setState(TEST_STATES.RUNNING);
        setTestResults(initialResults);
        getData(data => {
            setTestID(data.connection_test_id);
        });
    }


    return <form onSubmit={onSubmit}>
        {state !== TEST_STATES.NOT_RUNNING ? <TestResults {...testResults}/> : null}
        <ConnectionTestButton state={state}/>
    </form>
}

const TEST_TYPES = {
    ipv4: _('IPv4 connectivity'),
    ipv4_gateway: _('IPv4 gateway connectivity'),
    ipv6: _('IPv6 connectivity'),
    ipv6_gateway: _('IPv6 gateway connectivity'),
};

function TestResults(tests) {
    return <table className='table table-borderless table-hover offset-lg-3 col-lg-6 col-sm-12'>
        <tbody>
        {Object.keys(tests).map(
            test => {
                const type = TEST_TYPES[test];
                return type ? <TestResultItem key={type} type={type} result={tests[test]}/> : null;
            }
        )}

        </tbody>
    </table>;
}

function TestResultItem({type, result}) {
    let icon = null;
    switch (result) {
        case true:
            icon = <i className='fas fa-times text-danger'/>;
            break;
        case false:
            icon = <i className='fas fa-check text-success'/>;
            break;
        default:
            icon = <div className='spinner-border spinner-border-sm text-secondary' role='status'>
                <span className='sr-only'/>
            </div>;
    }

    return <tr>
        <th scope='row'>{type}</th>
        <td>{icon}</td>
    </tr>
}