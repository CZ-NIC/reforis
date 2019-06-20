/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, {useEffect} from 'react';
import {useAPIPost} from '../common/APIhooks';
import API_URLs from '../common/API';

const IMG_STATIC_URL = '/static/reforis/imgs';


export default function WorkflowSelect({workflows, postCallback}) {
    const [postWorkflowData, postWorkflow] = useAPIPost(API_URLs.guideWorkflow);

    useEffect(() => {
        if (postWorkflowData.data)
            if (postWorkflowData.isSuccess)
                postCallback()
    }, [postCallback, postWorkflowData.isSuccess, postWorkflowData.data]);

    function onWorkflowChangeHandler(workflow) {
        postWorkflow({workflow: workflow})
    }

    return <div id="workflow-selector">
        {workflows.map(workflow =>
            <button className="btn btn-outline-secondary" key={workflow}
                    onClick={e => onWorkflowChangeHandler(workflow)}>
                <img src={`${IMG_STATIC_URL}/workflow-${workflow}.svg`} alt={workflow}/>
            </button>
        )}
    </div>
}
