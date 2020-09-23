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
            <p>
                {_(
                    `Here you can find some information about your device. Please include it into your message if you contact our customer support.`
                )}
            </p>
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
        <div className="card p-4 table-responsive">
            <table className="table table-borderless table-hover mb-0">
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
                        <th>{_("reForis version")}</th>
                        <td>{deviceDetails.reforis_version}</td>
                    </tr>
                    <tr>
                        <th>{_("Turris OS version")}</th>
                        <td>{deviceDetails.os_version}</td>
                    </tr>
                    <tr>
                        <th>
                            {_("Turris OS branch")}
                            <i
                                className="text-muted fas fa-question-circle ml-1 help"
                                title={_(
                                    "Turris OS is currently released in various branches, which have different functions and varying stability - you can pick, which branch you want to test."
                                )}
                            />
                        </th>
                        <td>
                            <a
                                href="https://docs.turris.cz/geek/testing/#branches-available"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {deviceDetails.os_branch.value.toUpperCase()}
                                <sup>
                                    <i className="fas fa-external-link-alt ml-1" />
                                </sup>
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <th>{_("Kernel version")}</th>
                        <td>{deviceDetails.kernel}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

const AboutTableWithErrorAndSpinner = withSpinnerOnSending(
    withErrorMessage(AboutTable)
);
