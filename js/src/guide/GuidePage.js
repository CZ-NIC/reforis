/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import STEPS from "./steps";
import GuideHelper from "./GuideHelper";

GuidePage.propTypes = {
    ws: PropTypes.object.isRequired,
    step: PropTypes.string.isRequired,
    next_step: PropTypes.string.isRequired,
    passed: PropTypes.arrayOf(PropTypes.string).isRequired,
    current_workflow: PropTypes.string.isRequired,
    available_workflows: PropTypes.arrayOf(PropTypes.string).isRequired,
    getGuideData: PropTypes.func.isRequired,
};

export default function GuidePage({
    ws, step, next_step, current_workflow, available_workflows, passed, getGuideData,
}) {
    const Component = STEPS[step].component;
    return (
        <>
            <GuideHelper
                ws={ws}
                step={step}
                workflow={current_workflow}
                completed={passed.includes(step)}
                next_step={next_step}
            />
            <Component
                ws={ws}
                next_step={next_step}
                postCallback={getGuideData}
                workflows={available_workflows}
            />
        </>
    );
}
