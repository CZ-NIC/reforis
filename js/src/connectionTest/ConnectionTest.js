/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, {useEffect, useState} from 'react';

import ConnectionTestButton from './ConnectionTestButton';
import {useAPIGetData} from '../forisAPI/hooks';
import {ConnectionTestResults} from './ConnectionTestResult';

export const TEST_STATES = {
    NOT_RUNNING: 0,
    RUNNING: 1,
    FINISHED: 2,
};

export default function ConnectionTest({ws}) {
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

    useEffect(() => {
        const wsModule = 'wan';
        ws.subscribe(wsModule)
            .bind(wsModule, 'connection_test', msg => setTestResults(prevTestResults => ({...prevTestResults, ...msg.data.data})))
            .bind(wsModule, 'connection_test_finished', msg => {
                setTestResults(msg.data.data);
                setState(TEST_STATES.FINISHED);
            });
    }, []);

    function onSubmit(e) {
        e.preventDefault();
        setState(TEST_STATES.RUNNING);
        setTestResults(initialResults);
        getData(data => {
            setTestID(data.connection_test_id);
        });
    }

    return <form onSubmit={onSubmit}>
        {state !== TEST_STATES.NOT_RUNNING ? <ConnectionTestResults {...testResults}/> : null}
        <ConnectionTestButton state={state}/>
    </form>
}
