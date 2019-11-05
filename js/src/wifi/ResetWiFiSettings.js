/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import {
    Button, useAlert, ALERT_TYPES, useAPIPost, API_STATE,
} from "foris";

import API from "common/API";

ResetWiFiSettings.propTypes = {
    ws: PropTypes.object.isRequired,
};

export default function ResetWiFiSettings({ ws }) {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const module = "wifi";
        ws.subscribe(module)
            .bind(module, "reset", () => {
                setIsLoading(true);
                // eslint-disable-next-line no-restricted-globals
                setTimeout(() => location.reload(), 1000);
            });
    }, [ws]);

    const [postResetResponse, postReset] = useAPIPost(API.wifiReset);
    const [setAlert] = useAlert();
    useEffect(() => {
        if (postResetResponse.state === API_STATE.ERROR) {
            setAlert(_("An error occurred during resetting Wi-Fi settings"));
        } else if (postResetResponse.state === API_STATE.SUCCESS) {
            setAlert(_("Wi-Fi settings are set to defaults"), ALERT_TYPES.SUCCESS);
        }
    }, [postResetResponse, setAlert]);

    return (
        <>
            <h4>{_("Reset Wi-Fi Settings")}</h4>
            <p>
                {_(`
If a number of wireless cards doesn't match, you may try to reset the Wi-Fi settings. Note that this will remove the
current Wi-Fi configuration and restore the default values.
        `)}
            </p>
            <Button
                className="btn-warning"
                forisFormSize
                loading={isLoading}
                disabled={isLoading}

                onClick={() => postReset()}
            >
                {_("Reset Wi-Fi Settings")}
            </Button>
        </>
    );
}
