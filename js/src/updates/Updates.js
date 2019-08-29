/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import moment from "moment";
import PropTypes from "prop-types";

import { ForisForm } from "foris";
import API_URLs from "common/API";

import UpdatesForm from "./forms/UpdatesForm";
import LicenceModal from "./LicenceModal";

Updates.propTypes = {
    postCallback: PropTypes.func,
};

Updates.defaultProps = {
    postCallback: () => undefined,
};

export default function Updates({ postCallback }) {
    return (
        <>
            <h1>{_("Updates")}</h1>
            <p dangerouslySetInnerHTML={{
                __html: _(`
One of the most important features of router Turris are automatic system updates. Thanks to this function
your router's software stays up to date and offers better protection against attacks from the Internet.
<br/>
It is <b>highly recommended</b> to have this feature <b>turned on</b>. If you decide to disable it, be
warned that this might weaken the security of your router and network in case flaws in the software are
found.
<br/>
By turning the automatic updates on, you agree to this feature's license agreement. More information is
available <a href="" data-toggle="modal" data-target="#licenceModal">here</a>.
            `),
            }}
            />
            <LicenceModal />
            <ForisForm
                forisConfig={{
                    endpoint: API_URLs.updates,
                }}
                prepData={prepData}
                prepDataToSubmit={prepDataToSubmit}
                postCallback={postCallback}
                validator={validator}
            >
                <UpdatesForm />
            </ForisForm>
        </>
    );
}

function prepData(formData) {
    if (!formData.approval_settings.delay) formData.approval_settings.delay = 1;
    return formData;
}

function prepDataToSubmit(formData) {
    if (!formData.enabled) {
        delete formData.approval_settings;
        delete formData.languages;
        delete formData.user_lists;
    } else if (formData.approval_settings.status !== "delayed") delete formData.approval_settings.delay;
    return formData;
}

function validator(formData) {
    const rebootErrors = {};
    if (!moment(formData.reboots.time, "HH:mm", true).isValid()) rebootErrors.time = _("Time should be in HH:MM format.");
    if (formData.reboots.delay < 0 || formData.reboots.delay > 10) rebootErrors.delay = _("Number of days that must pass between receiving the request for restart and the automatic restart itself.");
    return rebootErrors.time || rebootErrors.delay ? { reboots: rebootErrors } : undefined;
}
