/*
 * Copyright (C) 2020-2021 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useAPIGet } from "foris";

import API_URLs from "common/API";

import "./Guide.css";
import "styles/dropdown.css";
import GuideRouterWithErrorAndSpinner from "./GuideRouter";

Guide.propTypes = {
    ws: PropTypes.object.isRequired,
};

export default function Guide({ ws }) {
    const [guideData, getGuideData] = useAPIGet(API_URLs.guide);
    const [getCustomizationResponse, getCustomization] = useAPIGet(
        API_URLs.about
    );
    useEffect(() => {
        getGuideData();
        getCustomization();
    }, [getCustomization, getGuideData]);

    return (
        <GuideRouterWithErrorAndSpinner
            ws={ws}
            apiState={getCustomizationResponse.state}
            guideData={guideData.data}
            getGuideData={getGuideData}
            deviceDetails={getCustomizationResponse.data || {}}
        />
    );
}
