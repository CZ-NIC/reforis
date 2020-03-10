/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import SkipGuideButton from "./SkipGuideButton";
import NextStepButtonWithRouter from "./NextStepButton";

GuideControls.propTypes = {
    next_step: PropTypes.string.isRequired,
};

export default function GuideControls({ next_step }) {
    return (
        <div className="sticky-top">
            <SkipGuideButton />
            <NextStepButtonWithRouter next_step={next_step} />
        </div>
    );
}
