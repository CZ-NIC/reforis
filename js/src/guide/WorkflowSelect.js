/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, {useEffect} from 'react';
import {useAPIPost} from '../common/APIhooks';
import API_URLs from '../common/API';
import {ForisURLs, REFORIS_URL_PREFIX} from '../common/constants';
import {GUIDE_URL_PREFIX} from './constance';

const IMG_STATIC_URL = `${ForisURLs.static}/imgs`;

const WORKFLOW_DESCRIPTIONS = {
    bridge: _('This workflow will help you to setup your device to act as a local server. It means that the device will provide some kind of service to other devices within your local network (e.g. act as a network-attached storage).'),
    router: _('After you finish this workflow your device will be able to act as a fully functional router. It assumes that you want to have more or less standard network setup.'),
    min: _('Just set your password and you are ready to go. This workflow is aimed to more advanced users who intend not to use the web GUI.'),
};

const WORKFLOW_NAMES = {
    bridge: _('Local server'),
    router: _('Router'),
    min: _('Minimal'),
};

export default function WorkflowSelect({workflows, next_step}) {
    const [postWorkflowData, postWorkflow] = useAPIPost(API_URLs.guideWorkflow);

    useEffect(() => {
        if (postWorkflowData.data && postWorkflowData.isSuccess)
            window.location.assign(`${REFORIS_URL_PREFIX}${GUIDE_URL_PREFIX}/${next_step}`);
    }, [next_step, postWorkflowData.data, postWorkflowData.isSuccess]);

    function onWorkflowChangeHandler(workflow) {
        postWorkflow({workflow: workflow})
    }

    return <>
        <h1>{_('Guide workflow')}</h1>
        <p>{_('Here you can set the guide walkthrough which will guide you through the basic configuration of your device.')}</p>
        <div id="workflow-selector">
            {workflows.map(workflow =>
                <div key={workflow} className="workflow">
                    <h3>{WORKFLOW_NAMES[workflow]}</h3>
                    <button className="btn btn-outline-secondary"
                            onClick={e => onWorkflowChangeHandler(workflow)}>
                        <img src={`${IMG_STATIC_URL}/workflow-${workflow}.svg`} alt={workflow}/>
                    </button>
                    <p>{WORKFLOW_DESCRIPTIONS[workflow]}</p>
                </div>
            )}
        </div>
    </>
}
