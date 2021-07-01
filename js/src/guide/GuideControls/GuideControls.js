/*
 * Copyright (C) 2020-2021 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import "./GuideControls.css";
import SkipGuideButtonWithRouter from "./SkipGuideButton";
import NextStepButtonWithRouter from "./NextStepButton";
import LanguagesDropdown from "../../main/TopBar/languagesDropdown/LanguagesDropdown";

GuideControls.propTypes = {
    ws: PropTypes.object.isRequired,
    next_step: PropTypes.string.isRequired,
};

export default function GuideControls({ ws, next_step }) {
    return (
        <div className="guide-controls col-lg-4 col-md-12 col-sm-12 mt-md-2 mt-lg-0">
            <LanguagesDropdown
                ws={ws}
                className="guide-controls-button btn-light"
            />
            <SkipGuideButtonWithRouter next_step={next_step} />
            <NextStepButtonWithRouter next_step={next_step} />
        </div>
    );
}
