/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import { ForisForm } from "foris";
import API_URLs from "common/API";

import NotificationsEmailSettingsForm from "./NotificationsEmailSettingsForm";
import validator from "./validator";
import TestNotification from "./TestNotification";

NotificationsSettings.propTypes = {
    ws: PropTypes.object.isRequired,
};

export default function NotificationsSettings({ ws }) {
    return (
        <>
            <h1>{_("Notifications")}</h1>
            <ForisForm
                ws={ws}
                forisConfig={{
                    endpoint: API_URLs.notificationsSettings,
                    wsModule: "router_notifications",
                    wsAction: "update_email_settings",
                }}
                prepData={prepData}
                prepDataToSubmit={prepDataToSubmit}
                validator={validator}
            >
                <NotificationsEmailSettingsForm />
                <TestNotification />
            </ForisForm>
            <div id="test-notification" />
        </>
    );
}

function prepData(formData) {
    formData = formData.emails;
    formData.common.to = formData.common.to.join(", ");
    return formData;
}

function prepDataToSubmit(formData) {
    if (!formData.enabled) return { enabled: false };
    formData.common.to = formData.common.to.replace(/\s+/g, "").split(",");

    if (formData.smtp_type === "turris") delete formData.smtp_custom;
    else if (formData.smtp_type === "custom") delete formData.smtp_turris;
    return formData;
}
