/*
 * Copyright (C) 2021 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";
import { ForisForm } from "foris";
import API_URLs from "../common/API";
import HostnameForm from "./HostnameForm";

Hostname.propTypes = {
    ws: PropTypes.object.isRequired,
};

export default function Hostname({ ws }) {
    return (
        <>
            <h1>{_("Hostname")}</h1>
            <p>{_("Here you can check and set the name of your device.")}</p>
            <ForisForm
                ws={ws}
                forisConfig={{
                    endpoint: API_URLs.hostname,
                    wsModule: "system",
                }}
                validator={validator}
            >
                <HostnameForm />
            </ForisForm>
        </>
    );
}

function validator(formData) {
    const errors = {};

    if (!/^[A-Za-z-_0-9]{1,63}$/.test(formData.hostname)) {
        errors.hostname = _(
            "The hostname can contain only alphanumeric characters, hyphens, underscores and can't be empty."
        );
    }
    return errors.hostname ? errors : undefined;
}
