/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

export default function wsTestResultMessage(testId, type) {
    return {
        module: "wan",
        action: "connection_test_finished",
        data: {
            passed: true,
            test_id: testId,
            data: testResults(testId, type)
        }
    };
}

function testResults(testId, type) {
    const dnsResults = type.startsWith("dns");
    const ipResults = !dnsResults;
    return {
        ipv6: ipResults,
        ipv6_gateway: ipResults,
        ipv4: ipResults,
        ipv4_gateway: ipResults,
        dns: dnsResults,
        dnssec: dnsResults
    };
}
