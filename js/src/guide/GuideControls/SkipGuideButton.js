/*
 * Copyright (C) 2020-2021 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import { withRouter } from "react-router-dom";
import { Button } from "foris";
import PropTypes from "prop-types";

import useGuideFinish from "../hooks";

SkipGuideButton.propTypes = {
    next_step: PropTypes.string.isRequired,
};

export function SkipGuideButton({ next_step }) {
    const onGuideFinishHandler = useGuideFinish();
    const disabled = next_step === "password";
    return (
        <Button
            className={`guide-controls-button btn btn-warning ${
                disabled ? "disabled" : ""
            }`}
            style={{ pointerEvents: "not-allowed" }}
            onClick={onGuideFinishHandler}
            disabled={disabled}
        >
            <span className="d-none d-sm-block">
                {_("Skip guide")}
                &nbsp;
            </span>
            <i className="fas fa-forward" />
        </Button>
    );
}

const SkipGuideButtonWithRouter = withRouter(SkipGuideButton);

export default SkipGuideButtonWithRouter;
