/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";
import ConnectionTest from "../connectionTest/ConnectionTest";
import Notifications from "../notifications/Notifications/Notifications";
import OpenVPNCard from "./Cards/OpenVPNCard";
import DataCollectionCard from "./Cards/DataCollectionCard";
import AutomaticUpdatesCard from "./Cards/AutomaticUpdatesCard";
import OpenVPNClientsCard from "./Cards/OpenVPNClientsCard";

import "./Overview.css";

Overview.propTypes = {
    ws: PropTypes.object.isRequired,
};

export default function Overview({ ws }) {
    return (
        <>
            <h1>Overview</h1>
            <div className="row row-cols-1 row-cols-md-3 mt-4">
                <OpenVPNCard />
                <DataCollectionCard />
                <AutomaticUpdatesCard />
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
                                                <span>Ping</span>
                                            </th>
                                            <td style={{ textAlign: "right" }}>
                                                <span>-1</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">
                                                <span>Upload</span>
                                            </th>
                                            <td style={{ textAlign: "right" }}>
                                                <span>921.155 Mb/s</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">
                                                <span>Download</span>
                                            </th>
                                            <td style={{ textAlign: "right" }}>
                                                <span>918.788 Mb/s</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </form>
                        </div>
                    </div>
                </div>
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
                <OpenVPNClientsCard />
            </div>
            <Notifications ws={ws} />
        </>
    );
}
