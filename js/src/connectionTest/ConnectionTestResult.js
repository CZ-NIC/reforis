/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";
import { SpinnerElement } from "foris";
import { TEST_STATES } from "./hooks";

const TEST_TYPES = {
    ipv4: _("IPv4 connectivity"),
    ipv4_gateway: _("IPv4 gateway connectivity"),
    ipv6: _("IPv6 connectivity"),
    ipv6_gateway: _("IPv6 gateway connectivity"),
    dns: "DNS",
    dnssec: "DNSSEC",
};

ConnectionTestResults.propTypes = {
    ipv4: PropTypes.bool,
    ipv4_gateway: PropTypes.bool,
    ipv6: PropTypes.bool,
    ipv6_gateway: PropTypes.bool,
    dns: PropTypes.bool,
    dnssec: PropTypes.bool,
    state: PropTypes.object,
};

export default function ConnectionTestResults({ state, ...tests }) {
    return (
        <table className="table table-borderless table-hover offset-lg-3 col-lg-6 col-sm-12">
            <tbody>
                {Object.keys(TEST_TYPES).map((type) =>
                    tests[type] !== undefined ? (
                        <ConnectionTestResultItem
                            key={type}
                            type={TEST_TYPES[type]}
                            result={tests[type]}
                            state={state}
                        />
                    ) : null
                )}
            </tbody>
        </table>
    );
}

ConnectionTestResultItem.propTypes = {
    type: PropTypes.string.isRequired,
    result: PropTypes.bool,
    state: PropTypes.object,
};

function ConnectionTestResultItem({ type, result, state }) {
    return (
        <tr>
            <th scope="row">{type}</th>
            <td>
                {state === TEST_STATES.RUNNING ? (
                    <SpinnerElement small className="text-secondary" />
                ) : (
                    <ConnectionTestIcon result={result} />
                )}
            </td>
        </tr>
    );
}

ConnectionTestIcon.propTypes = {
    result: PropTypes.bool,
};

function ConnectionTestIcon({ result }) {
    let icon;
    let iconColor;

    switch (result) {
        case true:
            icon = "check";
            iconColor = "success";
            break;
        case false:
            icon = "times";
            iconColor = "danger";
            break;
        default:
            icon = "minus";
            iconColor = "secondary";
    }
    return (
        <div className={`text-${iconColor}`}>
            <i className={`fas fa-${icon}`} />
        </div>
    );
}
