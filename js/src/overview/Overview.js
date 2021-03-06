/*
 * Copyright (C) 2020-2021 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect } from "react";
import PropTypes from "prop-types";
import {
    useAPIGet,
    withSpinnerOnSending,
    withErrorMessage,
    isPluginInstalled,
} from "foris";
import API_URLs from "../common/API";
import DynamicFirewallCard from "./Cards/DynamicFirewallCard";
import DataCollectionCard from "./Cards/DataCollectionCard";
import AutomaticUpdatesCard from "./Cards/AutomaticUpdatesCard";
import NetmetrCard from "./Cards/NetmetrCard";
import ConnectionTest from "../connectionTest/ConnectionTest";
import OpenVPNClientsCard from "./Cards/OpenVPNClientsCard";
import Notifications from "../notifications/Notifications/Notifications";

import "./Overview.css";
import displayCard from "./utils";

Overview.propTypes = {
    ws: PropTypes.object.isRequired,
};

export default function Overview({ ws }) {
    const [packageList, getPackageList] = useAPIGet(API_URLs.packages);
    useEffect(() => {
        getPackageList();
    }, [getPackageList]);

    return (
        <>
            <h1>{_("Overview")}</h1>
            <OverviewWithErrorAndSpinner
                apiState={packageList.state}
                packages={packageList.data || {}}
                ws={ws}
            />
        </>
    );
}

OverviewCards.propTypes = {
    packages: PropTypes.object.isRequired,
    ws: PropTypes.object.isRequired,
};

function OverviewCards({ packages, ws }) {
    return (
        <>
            <div className="row row-cols-1 row-cols-lg-3 mt-4">
                <AutomaticUpdatesCard />
                <DataCollectionCard />
                <DynamicFirewallCard
                    activated={displayCard(packages, "dynfw")}
                />
                {displayCard(packages, "netmetr") &&
                    isPluginInstalled("NetMetr") && <NetmetrCard />}
                <div className="col mb-4">
                    <div className="card h-100 user-select-none">
                        <div className="card-body">
                            <h6 className="text-uppercase text-muted mb-2">
                                {_("Connection Test")}
                            </h6>
                            <ConnectionTest ws={ws} type="overview" />
                        </div>
                    </div>
                </div>
                {displayCard(packages, "openvpn") &&
                    isPluginInstalled("OpenVPN") && <OpenVPNClientsCard />}
            </div>
            <Notifications ws={ws} />
        </>
    );
}

const OverviewWithErrorAndSpinner = withSpinnerOnSending(
    withErrorMessage(OverviewCards)
);
