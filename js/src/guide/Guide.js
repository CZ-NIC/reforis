/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, {useEffect} from 'react';
import {Redirect, Route, Switch} from 'react-router';

import {useAPIGet} from '../common/APIhooks';
import API_URLs from '../common/API';
import Spinner from '../common/bootstrap/Spinner';
import GuideNavigation from './GuideNavigation';
import {STEPS, URL_PREFIX} from './constance';
import {BrowserRouter} from 'react-router-dom';
import Portal from '../utils/Portal';
import {REFORIS_PREFIX} from '../common/constants';

export default function Guide({ws}) {
    const [guideData, getGuideData] = useAPIGet(API_URLs.guide);
    useEffect(() => {
        getGuideData();
    }, [getGuideData]);

    if (!guideData.data)
        return <Spinner className='row justify-content-center'/>;

    const {available_workflows, workflow_steps, next_step, passed} = guideData.data;

    return <BrowserRouter basename={`${REFORIS_PREFIX}${URL_PREFIX}`}>
        <Portal containerId='steps_container'>
            <GuideNavigation workflow_steps={workflow_steps} passed={passed} next_step={next_step}/>
        </Portal>
        <Switch>
            <Route exact path='/' render={() => <Redirect to={`/${next_step}`}/>}/>
            {workflow_steps.map(
                (step, idx) => {
                    const Component = STEPS[step].component;
                    return <Route
                        exact
                        key={idx}
                        path={`/${step}`}
                        component={() => <Component
                            ws={ws}
                            postCallback={getGuideData}
                            workflows={available_workflows}
                        />}
                    />
                }
            )}
            <Route render={() => <Redirect to={'/404'}/>}/>
        </Switch>
    </BrowserRouter>
}
