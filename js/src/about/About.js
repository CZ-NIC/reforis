/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect } from "react";
import { useAPIGet, Spinner } from "foris";
import API_URLs from "common/API";

export default function About() {
    const [state, get] = useAPIGet(API_URLs.about);

    useEffect(() => {
        get();
    }, [get]);

    if (state.isLoading || !state.data) return <Spinner className="row justify-content-center" />;

    return (
        <>
            <h1>{_("About")}</h1>
            <table className="table table-hover">
                <tbody>
                    <tr>
                        <th>{_("Device")}</th>
                        <td>{state.data.model}</td>
                    </tr>
                    <tr>
                        <th>{_("Serial number")}</th>
                        <td>{state.data.serial}</td>
                    </tr>
                    <tr>
                        <th>{_("Turris OS version")}</th>
                        <td>{state.data.os_version}</td>
                    </tr>
                    <tr>
                        <th>{_("Kernel version")}</th>
                        <td>{state.data.kernel}</td>
                    </tr>
                </tbody>
            </table>
        </>
    );
}
