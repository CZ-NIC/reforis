/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect } from "react";
import { Spinner, useAPIGet, API_STATE } from "foris";
import API_URLs from "common/API";

export default function About() {
    const [getAboutResponse, getAbout] = useAPIGet(API_URLs.about);

    useEffect(() => {
        getAbout();
    }, [getAbout]);

    if ([API_STATE.INIT, API_STATE.SENDING].includes(getAboutResponse.state)) {
        return <Spinner className="row justify-content-center" />;
    }

    return (
        <>
            <h1>{_("About")}</h1>
            <table className="table table-hover">
                <tbody>
                    <tr>
                        <th>{_("Device")}</th>
                        <td>{getAboutResponse.data.model}</td>
                    </tr>
                    <tr>
                        <th>{_("Serial number")}</th>
                        <td>{getAboutResponse.data.serial}</td>
                    </tr>
                    <tr>
                        <th>{_("Turris OS version")}</th>
                        <td>{getAboutResponse.data.os_version}</td>
                    </tr>
                    <tr>
                        <th>{_("Kernel version")}</th>
                        <td>{getAboutResponse.data.kernel}</td>
                    </tr>
                </tbody>
            </table>
        </>
    );
}
