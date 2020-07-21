/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useAPIGet, withSpinnerOnSending, withErrorMessage } from "foris";
import ConnectionTest from "../connectionTest/ConnectionTest";
import Notifications from "../notifications/Notifications/Notifications";
import DataCollectionCard from "./Cards/DataCollectionCard";
import Netmetr from "./Cards/NetmetrCard";
import "./Overview.css";
import API_URLs from "../common/API";

Overview.propTypes = {
    ws: PropTypes.object.isRequired,
};

export default function Overview({ ws }) {
    const [packageList, getPackageList] = useAPIGet(API_URLs.packages);
    useEffect(() => {
        getPackageList();
    }, [getPackageList]);

    return (
        <OverviewWithErrorAndSpinner
            apiState={packageList.state}
            packages={packageList.data || {}}
            ws={ws}
        />
    );
}

function displayCard(packages, cardName) {
    const enabledPackages = packages.package_lists.map((item) => {
        return item.enabled ? item.name : null;
    });
    return enabledPackages.includes(cardName);
}

OverviewCards.propTypes = {
    packages: PropTypes.object.isRequired,
    ws: PropTypes.object.isRequired,
};

function OverviewCards({ packages, ws }) {
    return (
        <>
            <h1>Overview</h1>
            <div className="row row-cols-1 row-cols-md-3 mt-4">
                <div className="col mb-4">
                    <div className="card">
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col">
                                    <h6 className="text-uppercase text-muted mb-2">
                                        VPN
                                    </h6>
                                    <span className="h3 mb-0">Activated</span>
                                </div>
                                <div className="col-auto">
                                    <span className="h2 mb-0 text-success">
                                        <i className="fas fa-check" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {displayCard(packages, "datacollect") ? (
                    <DataCollectionCard />
                ) : null}
                <div className="col mb-4">
                    <div className="card">
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col">
                                    <h6 className="text-uppercase text-muted mb-2">
                                        Automatic Updates
                                    </h6>
                                    <span className="h3 mb-0">Disabled</span>
                                </div>
                                <div className="col-auto">
                                    <span className="h2 mb-0 text-danger">
                                        <i className="fas fa-times" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {displayCard(packages, "net_monitoring") ? <Netmetr /> : null}
                <div className="col mb-4">
                    <div className="card h-100">
                        <div className="card-body">
                            <h6 className="text-uppercase text-muted mb-2">
                                Connection Test
                                <a href="javasript;" className="text-secondary">
                                    <i className="fas fa-cog float-right" />
                                </a>
                            </h6>
                            <ConnectionTest ws={ws} type="wan" />
                        </div>
                    </div>
                </div>
                <div className="col mb-4">
                    <div className="card h-100">
                        <div className="card-body">
                            <h6 className="text-uppercase text-muted mb-2">
                                Open VPN
                                <a href="javasript;" className="text-secondary">
                                    <i className="fas fa-cog float-right" />
                                </a>
                            </h6>
                            <form>
                                <table className="table table-borderless table-hover offset-lg-3 col-lg-6 col-sm-12">
                                    <tbody>
                                        <tr>
                                            <th scope="row">
                                                <span>Turris Omnia</span>
                                            </th>
                                            <td style={{ textAlign: "center" }}>
                                                <span className="text-success">
                                                    <i className="fas fa-check" />
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">
                                                <span>Turris MOX Home</span>
                                            </th>
                                            <td style={{ textAlign: "center" }}>
                                                <span className="text-success">
                                                    <i className="fas fa-check" />
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">
                                                <span>Turris Omnia Work</span>
                                            </th>
                                            <td style={{ textAlign: "center" }}>
                                                <span className="text-danger">
                                                    <i className="fas fa-times" />
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Notifications ws={ws} />
        </>
    );
}

const OverviewWithErrorAndSpinner = withSpinnerOnSending(
    withErrorMessage(OverviewCards)
);
