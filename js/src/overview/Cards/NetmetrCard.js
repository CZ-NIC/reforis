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
    const testsCount = tests.performed_tests.length;
    const lastTest = testsCount > 0 ? tests.performed_tests[0] : null;
    const time =
        testsCount > 0
            ? moment
                  .unix(lastTest.time)
                  .locale(ForisTranslations.locale)
                  .format("HH:mm DD.MM.YYYY")
            : null;

    return (
        <div className="col mb-4">
            <div className="card h-100">
                <div className="card-body">
                    <h6 className="text-uppercase text-muted mb-2">
                        NetMetr
                        <a
                            href="javasript;"
                            className="text-secondary"
                            title="Go to Netmetr"
                        >
                            <i className="fas fa-external-link-alt float-right" />
                        </a>
                    </h6>
                    {lastTest != null ? (
                        <form>
                            <table className="table table-borderless table-hover offset-lg-3 col-lg-6 col-sm-12">
                                <tbody>
                                    <tr>
                                        <th scope="row">
                                            {_("Download")}
                                            <span
                                                className="badge badge-secondary"
                                                title={_("Megabit per second")}
                                            >
                                                Mb/s
                                            </span>
                                        </th>
                                        <td className="text-right">
                                            {lastTest.speed_download}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">
                                            {_("Upload")}
                                            <span
                                                className="badge badge-secondary"
                                                title={_("Megabit per second")}
                                            >
                                                Mb/s
                                            </span>
                                        </th>
                                        <td className="text-right">
                                            <span>{lastTest.speed_upload}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">
                                            {_("Ping")}
                                            <span
                                                className="badge badge-secondary"
                                                title={_("Millisecond")}
                                            >
                                                ms
                                            </span>
                                        </th>
                                        <td className="text-right">
                                            <span>{lastTest.ping}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">{_("Date")}</th>
                                        <td className="text-right">
                                            <span>{time}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">{_("Link")}</th>
                                        <td className="text-right">
                                            <a
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                href={`https://www.netmetr.cz/en/detail.html?${lastTest.test_uuid}`}
                                            >
                                                {_("Details")}
                                                &nbsp;
                                                <sup>
                                                    <i className="fas fa-external-link-alt" />
                                                </sup>
                                            </a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </form>
                    ) : (
                        <p className="text-muted p-2">
                            {_("No tests have been performed lately.")}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

const NetmetrCardWithErrorAndSpinner = withSpinnerOnSending(
    withErrorMessage(NetmetrCard)
);
