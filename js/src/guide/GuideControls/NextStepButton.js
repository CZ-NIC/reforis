/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";

NextStepButton.propTypes = {
    next_step: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
};

export function NextStepButton({ next_step, location }) {
    const disabled = location.pathname === `/${next_step}`;
    return (
        <Link
            className={`guide-controls-button btn btn-primary ${disabled ? "disabled" : "blinking"}`}
            to={`/${next_step}`}
            disabled={disabled}
        >
            <div className="d-none d-sm-block">
                {_("Next step")}
            </div>
            <i className="fas fa-step-forward" />
        </Link>
    );
}

const NextStepButtonWithRouter = withRouter(NextStepButton);

export default NextStepButtonWithRouter;
