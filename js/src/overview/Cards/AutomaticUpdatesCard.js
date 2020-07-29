import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useAPIGet, withSpinnerOnSending, withErrorMessage } from "foris";
import API_URLs from "../../common/API";

export default function AutomaticUpdates() {
    const [getAutomaticUpdatesResponse, getAutomaticUpdates] = useAPIGet(
        API_URLs.updatesEnabled
    );
    useEffect(() => {
        getAutomaticUpdates();
    }, [getAutomaticUpdates]);

    return (
        <>
            <AutomaticUpdatesCardWithErrorAndSpinner
                apiState={getAutomaticUpdatesResponse.state}
                details={getAutomaticUpdatesResponse.data || {}}
            />
        </>
    );
}

AutomaticUpdatesCard.propTypes = {
    details: PropTypes.object.isRequired,
};

function AutomaticUpdatesCard({ details: { enabled } }) {
    return (
        <div className="col mb-4">
            <div className="card user-select-none">
                <div className="card-body">
                    <div className="row align-items-center">
                        <div className="col">
                            <h6 className="text-uppercase text-muted mb-2 ">
                                Automatic Updates
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

const AutomaticUpdatesCardWithErrorAndSpinner = withSpinnerOnSending(
    withErrorMessage(AutomaticUpdatesCard)
);
