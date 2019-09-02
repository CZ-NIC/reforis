/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect } from "react";
import PropTypes from "prop-types";

import {
    useAPIGet, useAPIPost, Button, Spinner,
} from "foris";
import API_URLs from "common/API";
import toLocaleDateString from "utils/localeDate";

import isUpdateAvailable from "./utils";

export default function UpdateApprovals() {
    const [getState, get] = useAPIGet(API_URLs.approvals);
    const approval = getState.data;
    useEffect(() => {
        get();
    }, [get]);

    const [postState, post] = useAPIPost(API_URLs.approvals);
    useEffect(() => {
        get();
    }, [get, postState.data]);

    function postHandler(solution) {
        return (e) => {
            e.preventDefault();
            post({ hash: approval.hash, solution });
        };
    }

    if (getState.isLoading || postState.isSending) return <Spinner className="row justify-content-center" />;

    if (!isUpdateAvailable(approval)) {
        return <p>{_("There are no updates awaiting your approval.")}</p>;
    }

    const packagesNumber = babel.format(
        ngettext(
            "There is %d package to be updated.",
            "There are %d packages to be updated.",
            approval.plan.length,
        ),
        approval.plan.length,
    );
    const details = _(
        "See <a data-toggle=\"collapse\" href=\"#plan-wrapper\" role=\"button\" aria-expanded=\"false\" aria-controls=\"plan-wrapper\">details</a>",
    );

    const buttonMargin = { marginBottom: "1rem" };

    return (
        <>
            <h3>{babel.format(_("Approve update from %s"), toLocaleDateString(approval.time))}</h3>
            <p dangerouslySetInnerHTML={{ __html: `${packagesNumber} ${details}` }} />
            <div className="collapse" id="plan-wrapper" data-testid="plan-wrapper">
                <Plan plan={approval.plan} />
            </div>
            <Button
                style={buttonMargin}
                className="btn btn-warning offset-lg-1 col-lg-4 col-sm-12"
                onClick={postHandler("deny")}
            >
                {_("Deny")}
            </Button>
            <Button
                style={buttonMargin}
                className="btn btn-primary col-sm-12 col-lg-4 offset-lg-2 col-lg-3"
                onClick={postHandler("grant")}
            >
                {_("Install now")}
            </Button>
        </>
    );
}

Plan.propTypes = {
    plan: PropTypes.arrayOf(PropTypes.object).isRequired,
};

function Plan({ plan }) {
    return (
        <table className="table table-hover">
            <thead>
                <tr>
                    <th scope="col">{_("Action")}</th>
                    <th scope="col">{_("Name")}</th>
                    <th scope="col">{_("Current")}</th>
                    <th scope="col">{_("New")}</th>
                </tr>
            </thead>
            <tbody>
                {plan.map((item) => <PlanItem key={item.name} {...item} />)}
            </tbody>
        </table>
    );
}

PlanItem.propTypes = {
    name: PropTypes.string.isRequired,
    op: PropTypes.string.isRequired,
    new_ver: PropTypes.string,
    cur_ver: PropTypes.string,
};

function PlanItem({
    name, op, new_ver, cur_ver,
}) {
    return (
        <tr>
            <td>{op}</td>
            <td>{name}</td>
            <td>{cur_ver}</td>
            <td>{new_ver}</td>
        </tr>
    );
}
