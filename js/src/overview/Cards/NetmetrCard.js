/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useAPIGet, withSpinnerOnSending, withErrorMessage } from "foris";
import moment from "moment";
import { API_MODULE_URLs } from "../../common/API";

export default function Netmetr() {
    const [getDataState, getDataRequest] = useAPIGet(API_MODULE_URLs.netmetr);
    useEffect(() => {
        getDataRequest();
    }, [getDataRequest]);

    return (
        <NetmetrCardWithErrorAndSpinner
            apiState={getDataState.state}
            tests={getDataState.data || {}}
        />
    );
}

NetmetrCard.propTypes = {
    tests: PropTypes.object.isRequired,
};

function NetmetrCard({ tests }) {
    const lastTest = tests.performed_tests[0];
    const time = moment
        .unix(lastTest.time)
        .locale(ForisTranslations.locale)
        .format("HH:mm DD.MM.YYYY");
    return (
        <>
            <div className="col mb-4">
                <div className="card h-100">
                    <div className="card-body">
                        <h6 className="text-uppercase text-muted mb-2">
                            NetMetr
                            <a href="javasript;" className="text-secondary">
                                <i className="fas fa-ellipsis-v float-right" />
                            </a>
                        </h6>
                        <form>
                            <table className="table table-borderless table-hover offset-lg-3 col-lg-6 col-sm-12">
                                <tbody>
                                    <tr>
                                        <th scope="row">
                                            <span>Download [Mb/s]</span>
                                        </th>
                                        <td style={{ textAlign: "right" }}>
                                            <span>
                                                {lastTest.speed_download}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">
                                            <span>Upload [Mb/s]</span>
                                        </th>
                                        <td style={{ textAlign: "right" }}>
                                            <span>{lastTest.speed_upload}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">
                                            <span>Ping [ms]</span>
                                        </th>
                                        <td style={{ textAlign: "right" }}>
                                            <span>{lastTest.ping}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">
                                            <span>Date</span>
                                        </th>
                                        <td style={{ textAlign: "right" }}>
                                            <span>{time}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">
                                            <span>Link</span>
                                        </th>
                                        <td style={{ textAlign: "right" }}>
                                            <a
                                                target="_blank"
                                                href={`https://www.netmetr.cz/en/detail.html?${lastTest.test_uuid}`}
                                            >
                                                {_("Details")}
                                                &nbsp;
                                                <i className="fas fa-external-link-alt" />
                                            </a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

const NetmetrCardWithErrorAndSpinner = withSpinnerOnSending(
    withErrorMessage(NetmetrCard)
);