import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useAPIGet, withSpinnerOnSending, withErrorMessage } from "foris";
import { API_MODULE_URLs } from "../../common/API";

export default function OpenVPN() {
    const [getOpenVPNResponse, getOpenVPN] = useAPIGet(API_MODULE_URLs.openvpn);
    useEffect(() => {
        getOpenVPN();
    }, [getOpenVPN]);

    return (
        <>
            <OpenVPNCardWithErrorAndSpinner
                apiState={getOpenVPNResponse.state}
                details={getOpenVPNResponse.data || {}}
            />
        </>
    );
}

OpenVPNCard.propTypes = {
    details: PropTypes.object.isRequired,
};

function OpenVPNCard({ details: { enabled } }) {
    return (
        <div className="col mb-4">
            <div className="card">
                <div className="card-body">
                    <div className="row align-items-center">
                        <div className="col">
                            <h6 className="text-uppercase text-muted mb-2">
                                OpenVPN
                            </h6>
                            <span className="h3 mb-0">
                                {enabled ? "Activated" : "Disabled"}
                            </span>
                        </div>
                        <div className="col-auto">
                            <span
                                className={`h2 mb-0 text-${
                                    enabled ? "success" : "danger"
                                }`}
                            >
                                <i
                                    className={`fas fa-${
                                        enabled ? "check" : "times"
                                    }`}
                                />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const OpenVPNCardWithErrorAndSpinner = withSpinnerOnSending(
    withErrorMessage(OpenVPNCard)
);
