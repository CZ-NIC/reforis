/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import { withRouter } from "react-router";
import { Link, NavLink } from "react-router-dom";
import PropTypes from "prop-types";

import useGuideFinish from "./hooks";
import STEPS from "./steps";

GuideNavigation.propTypes = {
    workflow_steps: PropTypes.arrayOf(PropTypes.string).isRequired,
    passed: PropTypes.arrayOf(PropTypes.string).isRequired,
    next_step: PropTypes.string.isRequired,
};

export default function GuideNavigation({ workflow_steps, passed, next_step }) {
    const onGuideFinishHandler = useGuideFinish();
    const navigationItems = workflow_steps.map(
        (step) => (
            <GuideNavigationItem
                key={step}
                name={STEPS[step].name}
                passed={passed.includes(step)}
                url={`/${step}`}
                next={step === next_step}
            />
        ),
    );

    return (
        <>
            <ul className="list-unstyled">
                {navigationItems}
            </ul>
            <NextStepButtonWithRouter next_step={next_step} />
            <button type="button" className="btn btn-link" onClick={onGuideFinishHandler}>
                {_("Skip guide")}
            </button>
        </>
    );
}

GuideNavigationItem.propTypes = {
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    passed: PropTypes.bool.isRequired,
    next: PropTypes.bool.isRequired,
};

function GuideNavigationItem({
    name, url, next, passed,
}) {
    const passedClassName = passed ? "passed" : "";
    const nextClassName = next ? "next" : "";

    const content = (
        <>
            <i className="fas fa-arrow-right" />
            {name}
        </>
    );

    return (
        <li>
            {passed || next
                ? (
                    <NavLink className={`${passedClassName} ${nextClassName}`} to={url}>
                        {content}
                    </NavLink>
                )
                // eslint-disable-next-line jsx-a11y/anchor-is-valid
                : <a>{content}</a>}
        </li>
    );
}

NextStepButton.propTypes = {
    next_step: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
};

function NextStepButton({ next_step, location }) {
    if (location.pathname === `/${next_step}`) return null;
    return (
        <Link id="next-step-button" className="btn btn-lg btn-light " to={`/${next_step}`}>
            <i className="fas fa-arrow-right" />
        </Link>
    );
}

const NextStepButtonWithRouter = withRouter(NextStepButton);
