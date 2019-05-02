/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, {useEffect, useState} from 'react';
import propTypes from 'prop-types';

import {useAPIGetData} from '../common/APIhooks';
import {APIEndpoints} from '../common/API';

import {TEST_STATES} from './testStates';
import ConnectionTestButton from './ConnectionTestButton';
import {ConnectionTestResults} from './ConnectionTestResult';


const TESTS_TYPES = {
    wan: ['ipv6', 'ipv6_gateway', 'ipv4', 'ipv4_gateway'],
    dns: ['dns', 'dnssec'],
};

const ENDPOINTS = {
    wan: APIEndpoints.connectionTest,
    dns: APIEndpoints.dnsTest,
};

ConnectionTest.propTypes = {
    ws: propTypes.object.isRequired,
    type: propTypes.oneOf(['wan', 'dns']).isRequired
};

export default function ConnectionTest({ws, type}) {
    const [state, setState] = useState(TEST_STATES.NOT_RUNNING);

    const tests = TESTS_TYPES[type];
    const initialResults = tests.reduce((tests, test) => {
        tests[test] = null;
        return tests
    }, {});
    const [testResults, setTestResults] = useState(initialResults);

    const [connectionTestTrigger] = useAPIGetData(ENDPOINTS[type]);

    useEffect(() => {
        const wsModule = 'wan';
        ws.subscribe(wsModule)
            .bind(wsModule, 'connection_test', msg => setTestResults(
                prevTestResults => ({...prevTestResults, ...filterResults(msg.data.data, type)}))
            )
            .bind(wsModule, 'connection_test_finished', msg => {
                setTestResults(filterResults(msg.data.data, type));
                setState(TEST_STATES.FINISHED);
            });
    }, []);

    function onSubmit(e) {
        e.preventDefault();
        setTestResults(initialResults);
        setState(TEST_STATES.RUNNING);
        connectionTestTrigger();
    }

    return <form onSubmit={onSubmit}>
        {state !== TEST_STATES.NOT_RUNNING ? <ConnectionTestResults {...testResults}/> : null}
        <ConnectionTestButton state={state}/>
    </form>
}

function filterResults(results, type) {
    return Object.keys(results)
        .filter(test => TESTS_TYPES[type].indexOf(test) !== -1)
        .reduce((res, test) => {
            res[test] = results[test];
            console.log(res);
            return res
        }, {});
}
