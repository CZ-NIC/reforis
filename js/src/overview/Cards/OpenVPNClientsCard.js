import React, { useEffect } from "react";
import PropTypes from "prop-types";
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
    clients: PropTypes.object.isRequired,
};

function OpenVPNClientsCard({ clients }) {
    return (
        <div className="col mb-4">
            <div className="card h-100">
                <div className="card-body">
                    <h6 className="text-uppercase text-muted mb-2">
                        OpenVPN Clients
                        <a href="javasript;" className="text-secondary">
                            <i className="fas fa-cog float-right" />
                        </a>
                    </h6>
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
                </div>
            </div>
        </div>
    );
}

const OpenVPNClientsCardWithErrorAndSpinner = withSpinnerOnSending(
    withErrorMessage(OpenVPNClientsCard)
);
