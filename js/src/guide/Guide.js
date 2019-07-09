/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, {useEffect} from 'react';

import {Redirect, Route} from 'react-router';
import {createBrowserHistory} from 'history';


import {useAPIGet} from '../common/APIhooks';
import API_URLs from '../common/API';
import Spinner from '../common/bootstrap/Spinner';
import GuideNavigation from './GuideNavigation';
import {STEPS, URL_PREFIX} from './constance';
import {BrowserRouter} from 'react-router-dom';

const guideHistory = createBrowserHistory();


export default function Guide({ws}) {
    const [guideData, getGuideData] = useAPIGet(API_URLs.guide);

    useEffect(() => {
        getGuideData();
    }, [getGuideData]);

    useEffect(() => {
        if (guideData.data)
            guideHistory.push(`${URL_PREFIX}/${guideData.data.next_step}`);
    }, [guideData.data]);


    if (guideData.isLoading || !guideData.data)
        return <Spinner className='row justify-content-center'/>;

    function postCallback() {
        getGuideData();
    }

    const {available_workflows, workflow_steps, next_step, passed} = guideData.data;

    return <>
        <BrowserRouter>
            <GuideNavigation
                workflow_steps={workflow_steps}
                passed={passed}
                next_step={next_step}
            />
            <div>
                <Route exact path={URL_PREFIX} render={() => <Redirect to={`${URL_PREFIX}/${next_step}`}/>}/>
                {workflow_steps.map(
                    (step, idx) => {
                        const Component = STEPS[step].component;
                        return <Route
                            key={idx}
                            path={`${URL_PREFIX}/${step}`}
                            component={() => <Component
                                postCallback={postCallback}
                                ws={ws}
                                workflows={available_workflows}
                            />}
                            exact
                        />
                    }
                )}
            </div>
            <Route render={() => <Redirect to={'/404'}/>} />
        </BrowserRouter>
    </>
}
