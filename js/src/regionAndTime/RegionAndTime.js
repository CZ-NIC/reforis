/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";
import moment from "moment";

import API_URLs from "common/API";
import { ForisForm } from "foris";

import RegionForm from "./RegionForm";
import TimeForm from "./TimeForm";

RegionAndTime.propTypes = {
    ws: PropTypes.object.isRequired,
    postCallback: PropTypes.func,
};

RegionAndTime.defaultProps = {
    postCallback: () => undefined,
};

export default function RegionAndTime({ ws, postCallback }) {
    return (
        <>
            <h1>{_("Region and Time")}</h1>
            <p>
                {_(`
It is important for your device to have the correct time set. If your device's time is delayed, the
procedure of SSL certificate verification might not work correctly.
        `)}
            </p>
            <ForisForm
                forisConfig={{
                    endpoint: API_URLs.regionAndTime,
                }}
                prepDataToSubmit={prepDataToSubmit}
                postCallback={postCallback}
                validator={validator}
            >
                <RegionForm />
                <TimeForm ws={ws} />
            </ForisForm>
        </>
    );
}

function validator(formData) {
    if (!moment(formData.time_settings.time).isValid()) return { time_settings: { time: _("Time should be in YYYY-MM-DD HH:MM:SS format.") } };
    return undefined;
}

function prepDataToSubmit(formData) {
    delete formData.time_settings.ntp_servers;
    if (formData.time_settings.how_to_set_time === "ntp") delete formData.time_settings.time;
    return formData;
}
