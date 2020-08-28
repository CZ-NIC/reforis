/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useAPIGet, withSpinnerOnSending, withErrorMessage } from "foris";
import { API_MODULE_URLs } from "../../common/API";

export default function OpenVPNClients() {
    const [getOpenVPNClientsResponse, getOpenVPNClients] = useAPIGet(
        API_MODULE_URLs.openvpnClients
    );
    useEffect(() => {
        getOpenVPNClients();
    }, [getOpenVPNClients]);

    return (
        <>
            <OpenVPNClientsCardWithErrorAndSpinner
                apiState={getOpenVPNClientsResponse.state}
                clients={getOpenVPNClientsResponse.data || {}}
            />
        </>
    );
}

OpenVPNClientsCard.propTypes = {
    clients: PropTypes.arrayOf(PropTypes.object).isRequired,
};

function OpenVPNClientsCard({ clients }) {
    return (
        <div className="col mb-4">
            <div className="card h-100 user-select-none">
                <div className="card-body">
                    <h6 className="text-uppercase text-muted mb-2">
                        {_("OpenVPN Clients")}
                        <Link
                            to={{
                                pathname: "/openvpn/client-settings",
                            }}
                            className="text-secondary"
                            title={_("Go to OpenVPN Client Settings")}
                        >
                            <i className="fas fa-chevron-right float-right" />
                        </Link>
                    </h6>
                    {typeof clients === "object" && clients.length !== 0 ? (
                        <form>
                            <table className="table table-borderless table-hover offset-lg-3 col-lg-6 col-sm-12">
                                <tbody>
                                    {clients.slice(0, 5).map((client) => (
                                        <tr key={client.id}>
                                            <th scope="row">
                                                <span>{client.id}</span>
                                            </th>
                                            <td className="text-right">
                                                <span
                                                    className={`text-${
                                                        client.enabled
                                                            ? "success"
                                                            : "danger"
                                                    }`}
                                                >
                                                    <i
                                                        className={`fas fa-${
                                                            client.enabled
                                                                ? "check"
                                                                : "times"
                                                        }`}
                                                    />
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </form>
                    ) : (
                        <p className="text-muted p-2">
                            {_("There are no clients added yet.")}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

const OpenVPNClientsCardWithErrorAndSpinner = withSpinnerOnSending(
    withErrorMessage(OpenVPNClientsCard)
);
