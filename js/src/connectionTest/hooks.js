/*
 * Copyright (C) 2019-2021 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import { useCallback, useEffect, useMemo, useState } from "react";

import API_URLs from "common/API";
import { useAPIPost, useWSForisModule } from "foris";

const TESTS_TYPES = {
    wan: ["ipv6", "ipv6_gateway", "ipv4", "ipv4_gateway"],
    IPv6Disabled: ["ipv4", "ipv4_gateway"],
    dns: ["dns", "dnssec"],
    overview: ["ipv6", "ipv6_gateway", "ipv4", "ipv4_gateway", "dns", "dnssec"],
};

const ENDPOINTS = {
    wan: API_URLs.connectionTest,
    dns: API_URLs.dnsTest,
    // dnsTest is also called for the overview type because it returns both wan and dns results
    overview: API_URLs.dnsTest,
};

export const TEST_STATES = {
    NOT_RUNNING: 0,
    RUNNING: 1,
    FINISHED: 2,
};

export default function useConnectionTest(ws, type) {
    const initialResults = useMemo(
        () =>
            TESTS_TYPES[type].reduce((tests, test) => {
                tests[test] = null;
                return tests;
            }, {}),
        [type]
    );

    const [state, setState] = useState(TEST_STATES.NOT_RUNNING);
    const [id, setId] = useState(null);
    const [results, setResults] = useState(initialResults);

    const updateResults = useCallback(
        (data) => {
            if (data && data.test_id === id) {
                setResults((prevTestResults) => ({
                    ...prevTestResults,
                    ...filterResults(data.data, type),
                }));
                if (data.passed) setState(TEST_STATES.FINISHED);
            }
        },
        [id, type]
    );

    const wsModule = "wan";
    const [wsData] = useWSForisModule(ws, wsModule, "connection_test");
    useEffect(() => {
        updateResults(wsData);
    }, [wsData, id, type, updateResults]);
    const [wsFinishedData] = useWSForisModule(
        ws,
        wsModule,
        "connection_test_finished"
    );
    useEffect(() => {
        updateResults(wsFinishedData);
    }, [wsFinishedData, id, type, updateResults]);

    const [triggerTestData, triggerTest] = useAPIPost(ENDPOINTS[type]);
    useEffect(() => {
        if (triggerTestData.data) {
            setState(TEST_STATES.RUNNING);
            setResults(initialResults);
            setId(triggerTestData.data.test_id);
        }
    }, [initialResults, triggerTestData]);

    return [state, results, triggerTest];
}

function filterResults(results, type) {
    console.log("results", results);
    return Object.keys(results)
        .filter((test) => TESTS_TYPES[type].indexOf(test) !== -1)
        .reduce((res, test) => {
            res[test] = results[test];
            return res;
        }, {});
}
