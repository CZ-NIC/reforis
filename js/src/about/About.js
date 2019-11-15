/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useAPIGet, withSpinnerOnSending, withErrorMessage } from "foris";
import API_URLs from "common/API";

export default function About() {
    const [getAboutResponse, getAbout] = useAPIGet(API_URLs.about);

    useEffect(() => {
        getAbout();
    }, [getAbout]);

    return (
        <>
            <h1>{_("About")}</h1>
            <AboutTableWithErrorAndSpinner
                apiState={getAboutResponse.state}
                deviceDetails={getAboutResponse.data || {}}
            />
        </>
    );
}

AboutTable.propTypes = {
    deviceDetails: PropTypes.object.isRequired,
};

function AboutTable({ deviceDetails }) {
    return (
        <table className="table table-hover">
            <tbody>
                <tr>
                    <th>{_("Device")}</th>
                    <td>{deviceDetails.model}</td>
                </tr>
                <tr>
                    <th>{_("Serial number")}</th>
                    <td>{deviceDetails.serial}</td>
                </tr>
                <tr>
                    <th>{_("Turris OS version")}</th>
                    <td>{deviceDetails.os_version}</td>
                </tr>
                <tr>
                    <th>{_("Kernel version")}</th>
                    <td>{deviceDetails.kernel}</td>
                </tr>
            </tbody>
        </table>
    );
}

const AboutTableWithErrorAndSpinner = withSpinnerOnSending(withErrorMessage(AboutTable));
