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
import DataCollectionCard from "./Cards/DataCollectionCard";
import AutomaticUpdatesCard from "./Cards/AutomaticUpdatesCard";

import "./Overview.css";

Overview.propTypes = {
    ws: PropTypes.object.isRequired,
};

export default function Overview({ ws }) {
    return (
        <>
            <h1>Overview</h1>
            <div className="row row-cols-1 row-cols-md-3 mt-4">
                <div className="col mb-4">
                    <div className="card">
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col">
                                    <h6 className="text-uppercase text-muted mb-2">VPN</h6>
                                    <span className="h3 mb-0">Activated</span>
                                </div>
                                <div className="col-auto">
                                    <span className="h2 mb-0 text-warning">
                                        <i class="fas fa-exclamation-triangle" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
