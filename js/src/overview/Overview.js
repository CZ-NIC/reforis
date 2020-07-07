/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";
import ConnectionTest from "../connectionTest/ConnectionTest";
import "./Overview.css";

Overview.propTypes = {
    ws: PropTypes.object.isRequired,
};

export default function Overview({ ws }) {
    const icon = <i className="fas fa-check-circle float-right mr-2 mt-1" />;
    return (
        <>
            <h1>Overview</h1>
            <div className="card border-secondary mb-3" style={{ maxWidth: "18rem" }}>
                <h5 className="card-header">Connection Test</h5>
                <div className="card-body">
                    <p className="card-text">
                        IPv4 connectivity
                        {icon}
                    </p>
                    <p className="card-text">
                        IPv4 gateway connectivity
                        {icon}
                    </p>
                    <p className="card-text">
                        IPv6 connectivity
                        {icon}
                    </p>
                    <p className="card-text">
                        IPv6 gateway connectivity
                        {icon}
                    </p>
                    <div className="text-center">
                        <a href="javascript;" className="btn btn-primary mt-2">Test connection</a>
                    </div>
                </div>
            </div>

            <div className="card border-secondary mb-3" style={{ maxWidth: "18rem" }}>
                <h5 className="card-header">Connection Test</h5>
                <div className="card-body">
                    <ConnectionTest ws={ws} type="wan" />
                </div>
            </div>
        </>
    );
}
