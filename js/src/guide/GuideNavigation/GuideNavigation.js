/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import STEPS from "../steps";
import GuideNavigationItem from "./GuideNavigationItem";

GuideNavigation.propTypes = {
    workflow_steps: PropTypes.arrayOf(PropTypes.string).isRequired,
    passed: PropTypes.arrayOf(PropTypes.string).isRequired,
    next_step: PropTypes.string.isRequired,
};

export default function GuideNavigation({ workflow_steps, passed, next_step }) {
    const navigationItems = workflow_steps.map((step) => (
        <GuideNavigationItem
            key={step}
            name={STEPS[step].name}
            passed={passed.includes(step)}
            url={`/${step}`}
            next={step === next_step}
        />
    ));

    return (
        <>
            <ul className="list-unstyled">{navigationItems}</ul>
        </>
    );
}
