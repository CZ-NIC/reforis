/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import ReactDOM from 'react-dom';
import React from 'react';
import {STEPS, URL_PREFIX} from './constance';
import {withRouter} from 'react-router';
import {Link} from 'react-router-dom';
import {useGuideFinish} from './hooks';

const NAVIGATION_CONTAINER_ID = 'steps_container';


function GuideNavigation({workflow_steps, passed, next_step, location}) {
    const alertContainer = document.getElementById(NAVIGATION_CONTAINER_ID);
    const onGuideFinishHandler = useGuideFinish();

    const navigationItems = workflow_steps.map(
        (step, idx) => {
            const url = `${URL_PREFIX}/${step}`;

            return <GuideNavigationItem
                key={idx}
                name={STEPS[step].name}
                passed={passed.includes(step)}
                url={url}
                active={location.pathname === url}
                next={step === next_step}
            />
        }
    );
    return ReactDOM.createPortal(
        <>
            <ul className="list-unstyled">
                {navigationItems}
            </ul>
            <button type="button" className="btn btn-link" onClick={onGuideFinishHandler}>
                {_('Skip guide')}
            </button>
        </>,
        alertContainer,
    )
}


function GuideNavigationItem({name, url, active, next, passed}) {
    const passedClassName = passed ? 'passed' : '';
    const nextClassName = next ? 'next' : '';
    const activeClassName = active ? 'active' : '';


    return <li className={`${passedClassName} ${activeClassName} ${nextClassName}`}>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        {passed || next ? <Link to={url}>{name}</Link> : <a href='#'>{name}</a>}
    </li>

}

export default withRouter(GuideNavigation);
