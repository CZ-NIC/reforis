/*
 * Copyright (C) 2020-2021 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useAPIGet, withSpinnerOnSending, withErrorMessage } from "foris";
import { API_MODULE_URLs } from "../../common/API";

export default function DataCollection() {
    const [getDataCollectionResponse, getDataCollection] = useAPIGet(
        API_MODULE_URLs.dataCollection
    );
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
    details: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
        .isRequired,
};

function DataCollectionCard({ details: { eula } }) {
    return (
        <div className="col mb-4">
            <div className="card user-select-none">
                <div className="card-body">
                    <div className="row align-items-center">
                        <div className="col">
                            <h6 className="text-uppercase text-muted mb-2">
                                {_("Threat Detection")}
                            </h6>
                            <span className="status">
                                {eula === 1 ? _("Activated") : _("Disabled")}
                            </span>
                        </div>
                        <div className="col-auto">
                            <span
                                className={`h2 text-${
                                    eula === 1 ? "success" : "danger"
                                }`}
                            >
                                <i
                                    className={`fas fa-${
                                        eula === 1 ? "check" : "times"
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

const DataCollectionCardWithErrorAndSpinner = withSpinnerOnSending(
    withErrorMessage(DataCollectionCard)
);
