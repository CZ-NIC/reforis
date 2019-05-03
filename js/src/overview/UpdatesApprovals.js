/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, {useState, useEffect} from 'react';
import propTypes from 'prop-types';
import moment from 'moment';

import {useAPIGetData, useAPIPostData} from '../common/APIhooks';
import {APIEndpoints} from '../common/API';
import Button from '../common/bootstrap/Button';

export default function UpdateApprovals() {
    const [getData, isReady] = useAPIGetData(APIEndpoints.approvals);
    const [approval, setApproval] = useState(false);
    useEffect(() => {
        getData(data => setApproval(data))
    }, []);


    const postData = useAPIPostData(APIEndpoints.approvals);

    function postHandler(solution) {
        return e => {
            e.preventDefault();
            postData(
                {hash: approval.hash, solution: solution},
                () => getData()
            )
        }
    }

    if (!isReady || !approval || !approval.present || approval.status !== 'asked')
        return null;

    const buttonMargin = {
        marginBottom: '1rem',
    };

    return <>
        <h3>{babel.format('Approve update from %s', moment(approval.time).format('YYYY-MM-DD HH:mm:ss'))}</h3>
        <Plan plan={approval.plan}/>
        <Button
            style={buttonMargin}
            className="btn btn-warning offset-lg-1 col-lg-4 col-sm-12"
            onClick={postHandler('deny')}
        >
            {_('Deny')}
        </Button> : null
        <Button
            style={buttonMargin}
            className={"btn btn-primary col-sm-12 col-lg-4 offset-lg-2 col-lg-3 offset-lg-8"}
            onClick={postHandler('grant')}
        >
            {_('Install now')}
        </Button>
    </>
}

Plan.propTypes = {
    plan: propTypes.arrayOf(propTypes.object).isRequired
};

function Plan({plan}) {
    return <table className="table table-hover">
        <thead>
        <tr>
            <th scope="col">{_('Action')}</th>
            <th scope="col">{_('Name')}</th>
            <th scope="col">{_('Current')}</th>
            <th scope="col">{_('New')}</th>
        </tr>
        </thead>
        <tbody>
        {plan.map(item => <PlanItem key={item.name} {...item}/>)}
        </tbody>
    </table>
}


PlanItem.propTypes = {
    name: propTypes.string.isRequired,
    op: propTypes.string.isRequired,
    new_ver: propTypes.string,
    cur_Ver: propTypes.string,
};

function PlanItem({name, op, new_ver, cur_ver}) {
    return <tr>
        <td>{op}</td>
        <td>{name}</td>
        <td>{cur_ver}</td>
        <td>{new_ver}</td>
    </tr>
}
