/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";

import { useAPIGet, Spinner, AlertContextProvider } from "foris";

import API_URLs from "common/API";
import UpdateChecker from "./UpdateChecker";
import UpdateApproval from "./UpdateApproval";

export default function Updates() {
    const [updateSettingsResponse, getUpdateSettings] = useAPIGet(API_URLs.updates);
    const updateSettings = updateSettingsResponse.data;
    useEffect(() => {
        getUpdateSettings();
    }, [getUpdateSettings]);

    let componentContent;
    if (updateSettingsResponse.isError) {
        componentContent = <p className="text-center text-danger">{_("An error occurred during loading update settings")}</p>;
    } else if (!updateSettingsResponse.isLoading && updateSettings) {
        const managerProps = getManagerProps(updateSettings);
        componentContent = <UpdateManager {...managerProps} />;
    } else {
        componentContent = <Spinner className="text-center" />;
    }

    return (
        <AlertContextProvider>
            <h1>{_("Updates")}</h1>
            {componentContent}
        </AlertContextProvider>
    );
}

function getManagerProps(updateSettings) {
    const updaterContent = {
        displayChecker: false,
        checkerLabel: "",
        displayApproval: false,
        description: _("Automatic updates are disabled. Please enable delayed or approval-requiring updates to review them."),
    };

    if (!updateSettings.enabled) {
        return updaterContent;
    }

    updaterContent.displayChecker = true;
    if (updateSettings.approval_settings.status === "off") {
        // Automatically installed updates
        updaterContent.checkerLabel = _("Check and install updates");
        updaterContent.description = _("Manually check for updates and install them immediately.");
    } else {
        // Updates that are delayed or need approval
        updaterContent.checkerLabel = _("Check updates");
        updaterContent.displayApproval = true;
        updaterContent.description = _("Manually check for updates and review them immediately.");
    }
    return updaterContent;
}

UpdateManager.propTypes = {
    displayChecker: PropTypes.bool.isRequired,
    checkerLabel: (props, propName) => {
        if (props.displayChecker === true && !props[propName]) {
            return new Error("checkerLabel is required if displayChecker is set to true");
        }
    },
    displayApproval: PropTypes.bool.isRequired,
    description: PropTypes.string,
};

function UpdateManager({
    displayChecker, checkerLabel, displayApproval, description,
}) {
    const [pending, setPending] = useState(false);

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

    let approvalComponent;
    if (pending || getApprovalsResponse.isLoading) {
        approvalComponent = <Spinner className="text-center" />;
    } else if (displayApproval && updateToApprove) {
        approvalComponent = (
            <UpdateApproval
                update={updateToApprove}
                onSuccess={getApprovals}
                className="mt-4"
            />
        );
    }

    return (
        <>
            {description}
            {displayChecker
                && (
                    <UpdateChecker
                        onSuccess={getUpdateToApprove}
                        pending={pending}
                        setPending={setPending}
                    >
                        {checkerLabel}
                    </UpdateChecker>
                )}
            {approvalComponent}
        </>
    );
}
