/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import "./GuideControls.css";
import SkipGuideButton from "./SkipGuideButton";
import NextStepButtonWithRouter from "./NextStepButton";
import LanguagesDropdown from "../../main/TopBar/languagesDropdown/LanguagesDropdown";

GuideControls.propTypes = {
    ws: PropTypes.object.isRequired,
    next_step: PropTypes.string.isRequired,
};

export default function GuideControls({ ws, next_step }) {
    return (
        <div className="guide-controls col-lg-4 col-md-12 col-sm-12 mt-md-2">
            <LanguagesDropdown
                ws={ws}
                className="guide-controls-button btn-light"
            />
            <SkipGuideButton />
            <NextStepButtonWithRouter next_step={next_step} />
        </div>
    );
}
