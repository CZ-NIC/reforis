/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";
import moment from "moment";

DHCPClientsList.propTypes = {
    clients: PropTypes.arrayOf(PropTypes.object),
};

export default function DHCPClientsList({ clients }) {
    return (
            <h2>{_("DHCP Client List")}</h2>
            <p>
                {_(
                    "This list contains all devices that are connected to the network through wired or wireless connections."
                )}
            </p>
            {clients.length === 0 ? (
                <p className="text-muted text-center">
                    {_("No DHCP clients found.")}
                </p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr className="text-center">
                                <th>{_("Expires")}</th>
                                <th>{_("IP Address")}</th>
                                <th>{_("MAC Address")}</th>
                                <th>{_("Hostname")}</th>
                                <th>{_("Active")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map((client) => (
                                <DHCPClientsListItem
                                    key={client.ip}
                                    {...client}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}

DHCPClientsListItem.propTypes = {
    ip: PropTypes.string.isRequired,
    expires: PropTypes.number.isRequired,
    mac: PropTypes.string.isRequired,
    hostname: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
};

function DHCPClientsListItem({ ip, expires, mac, hostname, active }) {
    return (
        <tr className="text-center">
            <td>{moment.unix(expires).format("YYYY-MM-DD HH:mm")}</td>
            <td>{ip}</td>
            <td>{mac}</td>
            <td>{hostname}</td>
            <td>
                <i className={`fas ${active ? "fa-check" : "fa-times"}`} />
            </td>
        </tr>
    );
}
