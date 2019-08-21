/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

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
};

export default function ConnectionTestResults({ ...tests }) {
    return (
        <table className="table table-borderless table-hover offset-lg-3 col-lg-6 col-sm-12">
            <tbody>
                {Object.keys(tests).map(
                    (test) => {
                        const type = TEST_TYPES[test];
                        return (type
                            ? (
                                <ConnectionTestResultItem
                                    key={type}
                                    type={type}
                                    result={tests[test]}
                                />
                            ) : null);
                    },
                )}

            </tbody>
        </table>
    );
}

ConnectionTestResultItem.propTypes = {
    type: PropTypes.string.isRequired,
    result: PropTypes.bool,
};

function ConnectionTestResultItem({ type, result }) {
    let icon = null;
    switch (result) {
    case true:
        icon = <i className="fas fa-check text-success" />;
        break;
    case false:
        icon = <i className="fas fa-times text-danger" />;
        break;
    default:
        icon = (
            <div className="spinner-border spinner-border-sm text-secondary" role="status">
                <span className="sr-only" />
            </div>
        );
    }

    return (
        <tr>
            <th scope="row">{type}</th>
            <td>{icon}</td>
        </tr>
    );
}
