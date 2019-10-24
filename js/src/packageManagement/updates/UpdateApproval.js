/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect, useContext } from "react";
import PropTypes from "prop-types";

import {
    useAPIPost, Button, Spinner, AlertContext,
} from "foris";
import API_URLs from "common/API";
import toLocaleDateString from "utils/localeDate";

UpdateApproval.propTypes = {
    update: PropTypes.object.isRequired,
    onSuccess: PropTypes.func.isRequired,
    className: PropTypes.string,
};

export default function UpdateApproval({ update, onSuccess, className }) {
    const setAlert = useContext(AlertContext);

    const [postState, post] = useAPIPost(API_URLs.approvals);
    // Execute callback when resolution is successful
    useEffect(() => {
        if (postState.isError) {
            setAlert(_("Cannot resolve update"));
        } else if (!postState.isSending && postState.data) {
            onSuccess();
        }
    }, [postState, onSuccess, setAlert]);

    function resolveUpdate(solution) {
        post({ hash: update.hash, solution });
    }

    if (postState.isSending) return <Spinner className="text-center" />;

    if (!update.approvable) {
        return <p className="text-center text-muted">{_("There are no updates awaiting your approval.")}</p>;
    }

    const packagesNumber = babel.format(
        ngettext(
            "There is %d package to be updated.",
            "There are %d packages to be updated.",
            update.plan.length,
        ),
        update.plan.length,
    );
    const details = _(
        "See <a data-toggle=\"collapse\" href=\"#plan-wrapper\" role=\"button\" aria-expanded=\"false\" aria-controls=\"plan-wrapper\">details</a>",
    );

    const buttonMargin = { marginBottom: "1rem" };

    return (
        <div className={className}>
            <h3>{babel.format(_("Approve update from %s"), toLocaleDateString(update.time))}</h3>
            <p dangerouslySetInnerHTML={{ __html: `${packagesNumber} ${details}` }} />
            <div className="collapse" id="plan-wrapper" data-testid="plan-wrapper">
                <Plan plan={update.plan} />
            </div>
            <Button
                style={buttonMargin}
                className="btn-warning offset-lg-1 col-lg-4 col-sm-12"
                onClick={() => resolveUpdate("deny")}
            >
                {_("Ignore")}
            </Button>
            <Button
                style={buttonMargin}
                className="btn-primary col-sm-12 col-lg-4 offset-lg-2 col-lg-3"
                onClick={() => resolveUpdate("grant")}
            >
                {_("Install now")}
            </Button>
        </div>
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
