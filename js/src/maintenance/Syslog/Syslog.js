/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import { ForisForm } from "foris";
import { API_MODULE_URLs } from "../../common/API";
import SyslogForm from "./SyslogForm";

export default function Syslog() {
    return (
        <ForisForm
            forisConfig={{
                endpoint: API_MODULE_URLs.storage,
            }}
            prepData={prepData}
            prepDataToSubmit={prepDataToSubmit}
            validator={validator}
        >
            <SyslogForm />
        </ForisForm>
    );
}

function prepData(formData) {
    return formData;
}

function prepDataToSubmit(formData) {
    delete formData.disk_mounted;
    delete formData.formating;
    delete formData.old_device;
    delete formData.old_uuid;
    delete formData.state;
    delete formData.uuid;

    return formData;
}

function validator(formData) {
    const errors = {};
    if (formData.disk_mounted !== true) {
        errors.noDiskMounted = _("A drive has to be configured first.");
    }
    return errors.noDiskMounted ? errors : undefined;
}
