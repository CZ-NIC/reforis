/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useAPIGet, withSpinnerOnSending, withErrorMessage } from "foris";
import API_URLs from "../common/API";
import OpenVPNCard from "./Cards/OpenVPNCard";
import DataCollectionCard from "./Cards/DataCollectionCard";
import AutomaticUpdatesCard from "./Cards/AutomaticUpdatesCard";
import NetmetrCard from "./Cards/NetmetrCard";
import ConnectionTest from "../connectionTest/ConnectionTest";
import OpenVPNClientsCard from "./Cards/OpenVPNClientsCard";
import Notifications from "../notifications/Notifications/Notifications";

import "./Overview.css";

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
    const enabledPackages = packages.package_lists
        .filter((item) => item.enabled)
        .map((item) => {
            return item.name;
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
                <OpenVPNCard />
                <DataCollectionCard />
                <AutomaticUpdatesCard />
                {displayCard(packages, "net_monitoring") ? (
                    <NetmetrCard />
                ) : null}
                <div className="col mb-4">
                    <div className="card h-100">
                        <div className="card-body">
                            <h6 className="text-uppercase text-muted mb-2">
                                Connection Test
                                <a
                                    href="/reforis/network-settings/wan"
                                    className="text-secondary"
                                    title="Go to Connection Settings"
                                >
                                    <i className="fas fa-external-link-alt float-right" />
                                </a>
                            </h6>
                            <ConnectionTest ws={ws} type="wan" />
                        </div>
                    </div>
                </div>
                {displayCard(packages, "openvpn") ? (
                    <OpenVPNClientsCard />
                ) : null}
            </div>
            <Notifications ws={ws} />
        </>
    );
}

const OverviewWithErrorAndSpinner = withSpinnerOnSending(
    withErrorMessage(OverviewCards)
);
