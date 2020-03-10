/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import { Button } from "foris";

import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import useGuideFinish from "./hooks";

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

function SkipGuideButton() {
    const onGuideFinishHandler = useGuideFinish();

    return (
        <Button
            className="btn btn-warning col-4 offset-1 mb-3"
            onClick={onGuideFinishHandler}
        >
            {_("Skip guide")}
            &nbsp;
            <i className="fas fa-forward" />
        </Button>
    );
}

NextStepButton.propTypes = {
    next_step: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
};

function NextStepButton({ next_step, location }) {
    const disabled = location.pathname === `/${next_step}`;
    return (
        <Link
            className={`btn btn-primary col-4 offset-2 mb-3 ${disabled ? "disabled" : "blinking"}`}
            to={`/${next_step}`}
            disabled={disabled}
        >
            {_("Next step")}
            &nbsp;
            <i className="fas fa-step-forward" />
        </Link>
    );
}

const NextStepButtonWithRouter = withRouter(NextStepButton);
