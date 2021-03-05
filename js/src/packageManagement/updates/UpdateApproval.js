/*
 * Copyright (C) 2019-2021 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect } from "react";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";

import {
    useAPIPost,
    Button,
    Spinner,
    useAlert,
    API_STATE,
    Alert,
    ALERT_TYPES,
    toLocaleDateString,
    ForisURLs,
} from "foris";
import moment from "moment";
import API_URLs from "common/API";

UpdateApproval.propTypes = {
    update: PropTypes.object.isRequired,
    onSuccess: PropTypes.func.isRequired,
    delay: PropTypes.number,
};

export default function UpdateApproval({ update, onSuccess, delay }) {
    const [setAlert, dismissAlert] = useAlert();

    const [postState, post] = useAPIPost(API_URLs.approvals);
    // Execute callback when resolution is successful
    useEffect(() => {
        if (postState.state === API_STATE.ERROR) {
            setAlert(_("Cannot install updates."));
        } else if (postState.state === API_STATE.SUCCESS) {
            onSuccess();
            setAlert(
                _("Updates will be installed shortly."),
                ALERT_TYPES.SUCCESS
            );
        }
    }, [postState, onSuccess, setAlert]);

    function resolveUpdate(solution) {
        dismissAlert();
        post({ data: { hash: update.hash, solution } });
    }

    if (postState.state === API_STATE.SENDING) {
        return <Spinner className="text-center" />;
    }

    const packagesNumber =
        update.approvable &&
        babel.format(
            ngettext(
                "There is %d package to be updated.",
                "There are %d packages to be updated.",
                update.plan.length
            ),
            update.plan.length
        );
    const details = _(
        'See <a data-toggle="collapse" href="#plan-wrapper" role="button" aria-expanded="false" aria-controls="plan-wrapper">details</a>'
    );
    const delayedTime = moment(update.time).add(delay, "hour");
    return (
        <>
            {update.approvable ? (
                <>
                    {delay && (
                        <Alert type={ALERT_TYPES.SUCCESS}>
                            <span>
                                {_(
                                    `These updates are not going to be 
                                    automatically installed before 
                                    ${toLocaleDateString(delayedTime)}.`
                                )}
                            </span>
                            <i
                                className="fas fa-question-circle ml-1 help"
                                data-for="delay-tooltip"
                                data-tip={_(
                                    `If you don't want the updates to be installed at all, go to
                                    <a href="${ForisURLs.packageManagement.updateSettings}">Update Settings</a> 
                                    and choose the option <b>Update approval needed</b>.`
                                )}
                                data-event="click focus"
                                data-html
                            />
                            <ReactTooltip
                                effect="solid"
                                globalEventOff="click"
                                clickable
                                id="delay-tooltip"
                            />
                        </Alert>
                    )}
                    <h3>
                        {babel.format(
                            _("Approve Update From %s"),
                            toLocaleDateString(update.time)
                        )}
                    </h3>
                    <p
                        dangerouslySetInnerHTML={{
                            __html: `${packagesNumber} ${details}`,
                        }}
                    />
                    <div
                        className="collapse"
                        id="plan-wrapper"
                        data-testid="plan-wrapper"
                    >
                        <Plan plan={update.plan} />
                    </div>
                    <div className="text-right">
                        <Button
                            className="btn-primary"
                            onClick={() => resolveUpdate("grant")}
                            forisFormSize
                        >
                            {_("Install now")}
                        </Button>
                    </div>
                </>
            ) : (
                <p className="text-center text-muted">
                    {_("There are no updates awaiting your approval.")}
                </p>
            )}
        </>
    );
}

Plan.propTypes = {
    plan: PropTypes.arrayOf(PropTypes.object).isRequired,
};

function Plan({ plan }) {
    return (
        <div className="table-responsive">
            <table className="table table-hover">
                <thead className="thead-light">
                    <tr>
                        <th scope="col">{_("Action")}</th>
                        <th scope="col">{_("Name")}</th>
                        <th scope="col">{_("Current")}</th>
                        <th scope="col">{_("New")}</th>
                    </tr>
                </thead>
                <tbody>
                    {plan.map((item) => (
                        <PlanItem key={item.name} {...item} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

PlanItem.propTypes = {
    name: PropTypes.string.isRequired,
    op: PropTypes.string.isRequired,
    new_ver: PropTypes.string,
    cur_ver: PropTypes.string,
};

function PlanItem({ name, op, new_ver, cur_ver }) {
    return (
        <tr>
            <td>{op}</td>
            <td>{name}</td>
            <td>{cur_ver}</td>
            <td>{new_ver}</td>
        </tr>
    );
}
