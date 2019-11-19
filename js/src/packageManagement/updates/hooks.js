/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import {
    API_STATE, useAlert, useAPIGet, useAPIPolling, useAPIPost,
} from "foris";
import { useCallback, useEffect, useState } from "react";

import API_URLs from "common/API";

const REFRESH_INTERVAL = 500; // milliseconds

export function usePending() {
    const [pending, setPending] = useState(false);
    const [getUpdatesStatusResponse, getUpdatesStatus] = useAPIGet(API_URLs.updatesStatus);
    useEffect(() => {
        getUpdatesStatus();
    }, [getUpdatesStatus]);
    useEffect(() => {
        if (getUpdatesStatusResponse.state === API_STATE.SUCCESS) {
            setPending(getUpdatesStatusResponse.data.running);
        }
    }, [getUpdatesStatusResponse]);
    return [pending, setPending];
}

export function useApprovals(displayApproval) {
    const [getApprovalsResponse, getApprovals] = useAPIGet(API_URLs.approvals);
    const updateToApprove = getApprovalsResponse.data;
    // Request can be ignored - UpdateApproval is hidden
    const getUpdateToApprove = useCallback(() => {
        if (displayApproval) {
            return getApprovals();
        }
    }, [displayApproval, getApprovals]);
    useEffect(() => {
        getUpdateToApprove();
    }, [getUpdateToApprove]);

    return [getApprovalsResponse, getApprovals, updateToApprove, getUpdateToApprove];
}

export function useUpdates(onSuccess, pending, setPending) {
    useCheckUpdatesPolling(onSuccess, pending, setPending);
    return useCheckUpdates(setPending);
}

function useCheckUpdatesPolling(onSuccess, pending, setPending) {
    const [setAlert] = useAlert();

    const [checkStatusPollingResponse] = useAPIPolling(
        API_URLs.updatesStatus,
        REFRESH_INTERVAL,
        pending,
    );

    useEffect(() => {
        if (checkStatusPollingResponse.state === API_STATE.SUCCESS) {
            const isRunning = checkStatusPollingResponse.data.running;
            setPending(isRunning);
            if (!isRunning) {
                onSuccess();
            }
        } else if (checkStatusPollingResponse.state === API_STATE.ERROR) {
            setPending(false);
            setAlert(_("Cannot fetch updater status."));
        }
    },
    [checkStatusPollingResponse, onSuccess, setPending, setAlert]);
}

function useCheckUpdates(setPending) {
    const [setAlert] = useAlert();

    const [runUpdatesResponse, runUpdates] = useAPIPost(API_URLs.runUpdates);
    // Trigger updater status checker after updater is enabled
    useEffect(() => {
        if (runUpdatesResponse.state === API_STATE.SUCCESS) {
            setPending(true);
        } else if (runUpdatesResponse.state === API_STATE.ERROR) {
            setPending(false);
            setAlert(runUpdatesResponse.data);
        }
    }, [runUpdatesResponse, setPending, setAlert]);

    return () => {
        setPending(true);
        runUpdates();
    };
}
