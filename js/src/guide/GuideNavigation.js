/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';

import {STEPS} from './constance';

import {useGuideFinish} from './hooks';
import {withRouter} from 'react-router';
import {Link, NavLink} from 'react-router-dom';

export default function GuideNavigation({workflow_steps, passed, next_step}) {
    const onGuideFinishHandler = useGuideFinish();
    const navigationItems = workflow_steps.map(
        (step, idx) => {
            return <GuideNavigationItem
                key={idx}
                name={STEPS[step].name}
                passed={passed.includes(step)}
                url={`/${step}`}
                next={step === next_step}
            />
        }
    );

    return <>
        <ul className="list-unstyled">
            {navigationItems}
        </ul>
        <NextStepButtonWithRouter next_step={next_step}/>
        <button type="button" className="btn btn-link" onClick={onGuideFinishHandler}>
            {_('Skip guide')}
        </button>
    </>
}

function GuideNavigationItem({name, url, next, passed}) {
    const passedClassName = passed ? 'passed' : '';
    const nextClassName = next ? 'next' : '';

    const content = <>
        <i className="fas fa-arrow-right"/>&nbsp;{name}
    </>;

    return <li>
        {passed || next ?
            <NavLink className={`${passedClassName} ${nextClassName}`} to={url}>
                {content}
            </NavLink>
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            : <a href='#'>{content}</a>}
    </li>
}

function NextStepButton({next_step, location}) {
    if (location.pathname === `/${next_step}`)
        return null;
    return <Link id='next-step-button' className='btn btn-lg btn-light ' to={`/${next_step}`}>
        <i className="fas fa-arrow-right"/>
    </Link>
}

const NextStepButtonWithRouter = withRouter(NextStepButton);
