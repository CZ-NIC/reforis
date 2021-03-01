/*
 * Copyright (C) 2019-2021 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect } from "react";

import { useAPIGet, ForisURLs } from "foris";

import API_URLs from "common/API";
import UpdateManager from "./UpdateManager";

export default function Updates() {
    const [updateSettingsResponse, getUpdateSettings] = useAPIGet(
        API_URLs.updates
    );
    const updateSettings = updateSettingsResponse.data || {};
    useEffect(() => {
        getUpdateSettings();
    }, [getUpdateSettings]);

    const managerProps = getManagerProps(updateSettings);
    return (
        <>
            <h1>{_("Updates")}</h1>
            <p>
                {_(
                    `In Turris OS, you decide when and how to get the latest updates
                    to keep your device running smoothly and securely.`
                )}
            </p>
            <UpdateManager
                apiState={updateSettingsResponse.state}
                {...managerProps}
            />
        </>
    );
}

function getManagerProps(updateSettings) {
    const managerProps = {
        displayChecker: false,
        checkerLabel: "",
        displayApproval: false,
        description: _(
            `Automatic updates are disabled. Please enable 
            <a href="${ForisURLs.packageManagement.updateSettings}">delayed or 
            approval-requiring updates</a> to review them.`
        ),
        delay: 0,
    };

    if (!updateSettings || !updateSettings.enabled) {
        return managerProps;
    }

    managerProps.displayChecker = true;
    if (updateSettings.approval_settings.status === "off") {
        // Automatically installed updates
        managerProps.checkerLabel = _("Check and install updates");
        managerProps.description = _(
            "Manually check for updates and install them immediately."
        );
    } else {
        // Updates that are delayed or need approval
        managerProps.checkerLabel = _("Check updates");
        managerProps.displayApproval = true;
        managerProps.description = _(
            "Manually check for updates and review them immediately."
        );
        managerProps.delay = updateSettings.approval_settings.delay;
    }
    return managerProps;
}
