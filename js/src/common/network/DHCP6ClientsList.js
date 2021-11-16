/*
 * Copyright (C) 2019-2021 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { formFieldsSize } from "foris";

DHCP6ClientsList.propTypes = {
    ipv6clients: PropTypes.arrayOf(PropTypes.object),
};

DHCP6ClientsList.defaultProps = {
    ipv6clients: [],
};

export default function DHCP6ClientsList({ ipv6clients }) {
    return (
        <div className={formFieldsSize}>
            <h2>{_("IPv6 DHCP Client List")}</h2>
            <p>
                {_(
                    "This list contains all devices that are connected to the network through wired or wireless connections using IPv6."
                )}
            </p>
            {ipv6clients.length === 0 ? (
                <p className="text-muted text-center">
                    {_("No clients found.")}
                </p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead className="thead-light">
                            <tr className="text-left">
                                <th>{_("Hostname")}</th>
                                <th>{_("IPv6 Address")}</th>
                                <th>{_("DUID")}</th>
                                <th className="text-center">{_("Expires")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ipv6clients.map((client) => (
                                <DHCP6ClientsListItem
                                    key={client.ipv6}
                                    {...client}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

DHCP6ClientsListItem.propTypes = {
    ipv6: PropTypes.string.isRequired,
    expires: PropTypes.number.isRequired,
    duid: PropTypes.string.isRequired,
    hostname: PropTypes.string.isRequired,
};

function DHCP6ClientsListItem({ ipv6, expires, duid, hostname }) {
    return (
        <tr className="text-left">
            <td>{hostname}</td>
            <td>{ipv6}</td>
            <td>{duid}</td>
            <td className="text-center">
                {expires
                    ? moment.unix(expires).format("YYYY-MM-DD HH:mm")
                    : _("Never")}
            </td>
        </tr>
    );
}
