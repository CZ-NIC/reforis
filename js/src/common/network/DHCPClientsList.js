/*
 * Copyright (C) 2019-2021 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { Button, formFieldsSize } from "foris";
import StaticLeaseModal from "../../lan/StaticLeaseModal";

DHCPClientsList.propTypes = {
    clients: PropTypes.arrayOf(PropTypes.object),
};

export default function DHCPClientsList({ clients }) {
    const [staticLeaseModalShown, setStaticLeaseModalShown] = useState(false);

    function addStaticLease() {
        setStaticLeaseModalShown(true);
    }

    function addNewTableItem(newStaticLease) {
        clients.push(newStaticLease);
    }

    return (
        <div className={formFieldsSize}>
            <h2>{_("DHCP Client List")}</h2>
            <p>
                {_(
                    "This list contains all devices that are connected to the network through wired or wireless connections."
                )}
            </p>
            {clients.length === 0 ? (
                <p className="text-muted text-center">
                    {_("No clients found.")}
                </p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead className="thead-light">
                            <tr className="text-left">
                                <th>{_("Hostname")}</th>
                                <th>{_("IPv4 Address")}</th>
                                <th>{_("MAC Address")}</th>
                                <th className="text-center">{_("Expires")}</th>
                                <th className="text-center">{_("Active")}</th>
                                <th className="text-center"></th>
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
            <div className="text-right">
                <Button
                    forisFormSize
                    className="btn-success"
                    onClick={addStaticLease}
                >
                    {_("Add static lease")}
                </Button>
            </div>
            <StaticLeaseModal
                shown={staticLeaseModalShown}
                setShown={setStaticLeaseModalShown}
                title={_("Add static lease")}
                addNewTableItem={addNewTableItem}
            />
        </div>
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
    const invalidDate = !moment.unix(expires).isValid() || expires === 0;

    return (
        <tr className="text-left">
            <td>{hostname}</td>
            <td>{ip}</td>
            <td>{mac}</td>
            <td
                className="text-center"
                title={invalidDate && "Date is not available"}
            >
                {!invalidDate
                    ? moment.unix(expires).format("YYYY-MM-DD HH:mm")
                    : "N/A"}
            </td>
            <td className="text-center">
                <i
                    className={`fas ${
                        active
                            ? "fa-check text-success"
                            : "fa-times text-danger"
                    }`}
                    title={
                        active ? _("Device is active") : _("Device is inactive")
                    }
                />
            </td>
            <td className="text-right">
                <div className="btn-group btn-group-sm">
                    <Button className="btn-primary">
                        <i className="fas fa-edit fa-sm mr-1" />
                        {_("Edit")}
                    </Button>
                    <Button className="btn-danger">
                        <i className="fas fa-trash fa-sm mr-1" />
                        {_("Delete")}
                    </Button>
                </div>
            </td>
        </tr>
    );
}
