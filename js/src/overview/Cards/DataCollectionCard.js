import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useAPIGet, withSpinnerOnSending, withErrorMessage } from "foris";
import { API_MODULE_URLs } from "../../common/API";


export default function DataCollection() {
    const [getDataCollectionResponse, getDataCollection] = useAPIGet(API_MODULE_URLs.dataCollection);
    useEffect(() => {
        getDataCollection();
    }, [getDataCollection]);

    return (
        <>
            <DataCollectionCardWithErrorAndSpinner
                apiState={getDataCollectionResponse.state}
                details={getDataCollectionResponse.data || {}}
            />

        </>
    );
}

DataCollectionCard.propTypes = {
    details: PropTypes.object.isRequired,
};

function DataCollectionCard({ details: { eula } }) {
    return (
        <div className="col mb-4">
            <div className="card">
                <div className="card-body">
                    <div className="row align-items-center">
                        <div className="col">
                            <h6 className="text-uppercase text-muted mb-2">Data Collection</h6>
                            <span className="h3 mb-0">{eula === 1 ? "Activated" : "Disabled"}</span>
                        </div>
                        <div className="col-auto">
                            <span className={`h2 mb-0 text-${eula === 1 ? "success" : "danger"}`}>
                                <i className="fas fa-check" />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const DataCollectionCardWithErrorAndSpinner = withSpinnerOnSending(withErrorMessage(DataCollectionCard));

