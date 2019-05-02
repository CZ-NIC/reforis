/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, {useEffect, useState} from 'react';

import {useAPIGetData} from '../common/APIhooks';
import {APIEndpoints} from '../common/API';

import {TEST_STATES} from './testStates';
import ConnectionTestButton from './ConnectionTestButton';
import {ConnectionTestResults} from './ConnectionTestResult';

export default function connectionTest(ws, type) {
    const [state, setState] = useState(TEST_STATES.NOT_RUNNING);
    const initialResults =
        type === 'wan' ?
            {
                ipv6: null,
                ipv6_gateway: null,
                ipv4: null,
                ipv4_gateway: null,
            }
            : type === 'dns' ?
            {
                dns: null,
                dnssec: null,
            }
            : null;
    const endpoint = type === 'wan' ? APIEndpoints.connectionTest : type === 'dns' ? APIEndpoints.dnsTest : null;
    const [testResults, setTestResults] = useState(initialResults);
    const [connectionTestTrigger] = useAPIGetData(endpoint);

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
        connectionTestTrigger();
    }

    return <form onSubmit={onSubmit}>
        {state !== TEST_STATES.NOT_RUNNING ? <ConnectionTestResults {...testResults} type={type}/> : null}
        <ConnectionTestButton state={state}/>
    </form>
}
