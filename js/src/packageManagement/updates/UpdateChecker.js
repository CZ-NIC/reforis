/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect } from "react";
import PropTypes from "prop-types";

import {
    useAPIGet, useAPIPost, Button, useAlert,
} from "foris";

import API_URLs from "common/API";

const REFRESH_INTERVAL = 500; // milliseconds

UpdateChecker.propTypes = {
    onSuccess: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
    setPending: PropTypes.func.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};

export default function UpdateChecker({
    onSuccess, pending, setPending, children,
}) {
    const refreshUpdates = useUpdates(onSuccess, setPending);

    return (
        <Button
            className="btn-primary mb-3"
            forisFormSize
            onClick={refreshUpdates}
            disabled={pending}
        >
            {children}
        </Button>
    );
}

function useUpdates(onSuccess, setPending) {
    const [setAlert] = useAlert();

    const [checkStatusResponse, checkStatus] = useAPIGet(API_URLs.updatesStatus);
    // Wait until updater stops working
    useEffect(() => {
        if (checkStatusResponse.isError) {
            setPending(false);
            setAlert(_("Cannot fetch updater status"));
        } else if (!checkStatusResponse.isLoading && checkStatusResponse.data) {
            if (checkStatusResponse.data.running !== false) {
                const timeout = setTimeout(() => checkStatus(), REFRESH_INTERVAL);
                return () => clearTimeout(timeout);
            }
            onSuccess();
            setPending(false);
        }
    }, [checkStatusResponse, checkStatus, onSuccess, setPending, setAlert]);

    const [runUpdatesResponse, runUpdates] = useAPIPost(API_URLs.runUpdates);
    // Trigger updater status checker after updater is enabled
    useEffect(() => {
        if (runUpdatesResponse.isSuccess) {
            checkStatus();
        } else if (runUpdatesResponse.isError) {
            setPending(false);
            setAlert(runUpdatesResponse.data);
        }
    }, [runUpdatesResponse, checkStatus, setPending, setAlert]);

    return () => {
        setPending(true);
        runUpdates();
    };
}
