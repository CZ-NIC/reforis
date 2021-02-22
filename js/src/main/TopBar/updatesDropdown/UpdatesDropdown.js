/*
 * Copyright (C) 2020-2021 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import {
    ForisURLs,
    useAPIGet,
    useAPIPost,
    SpinnerElement,
    Button,
    API_STATE,
    withEither,
    withSending,
} from "foris";
import API_URLs from "common/API";

UpdatesDropdown.propTypes = {
    newNotification: PropTypes.bool.isRequired,
};

export default function UpdatesDropdown({ newNotification }) {
    const [getApprovalsResponse, getApprovals] = useAPIGet(API_URLs.approvals);
    const update = getApprovalsResponse.data || {};
    useEffect(() => {
        getApprovals();
    }, [getApprovals]);

    const updateWithNotification = useCallback(() => {
        if (newNotification) {
            return getApprovals();
        }
    }, [newNotification, getApprovals]);

    useEffect(() => {
        updateWithNotification();
    }, [updateWithNotification]);

    if (update.approvable === false) {
        return null;
    }

    return (
        <div className="dropdown" data-testid="updates-dropdown">
            <DropdownContentWithSpinner
                apiState={getApprovalsResponse.state}
                update={update}
                onSuccess={getApprovals}
            />
        </div>
    );
}

DropdownContent.propTypes = {
    update: PropTypes.object.isRequired,
    onSuccess: PropTypes.func.isRequired,
};

function DropdownContent({ update, onSuccess }) {
    const [postApprovalResponse, postApproval] = useAPIPost(API_URLs.approvals);
    // Reload approvals when resolution is successful
    useEffect(() => {
        if (postApprovalResponse.state === API_STATE.SUCCESS) {
            onSuccess();
        }
    }, [onSuccess, postApprovalResponse]);

    function resolveUpdate(solution) {
        postApproval({ data: { hash: update.hash, solution } });
    }

    const updateFailed = postApprovalResponse.state === API_STATE.ERROR;
    return (
        <>
            <button type="button" className="nav-item btn btn-link">
                <i
                    className={`fa fa-sync-alt fa-lg ${
                        updateFailed ? "text-danger" : ""
                    }`.trim()}
                />
            </button>
            <div className="dropdown-menu dropdown-menu-right shadow-sm">
                <div className="dropdown-header">
                    <Link
                        to={{
                            pathname: ForisURLs.approveUpdates,
                        }}
                    >
                        <h5>{_("Approve Update")}</h5>
                    </Link>
                </div>
                <div className="dropdown-divider" />
                <ManageUpdateWithError
                    updateFailed={updateFailed}
                    resolveUpdate={resolveUpdate}
                />
            </div>
        </>
    );
}

const withSmallSpinner = withSending(() => (
    <button type="button" className="nav-item btn btn-link">
        <SpinnerElement small />
    </button>
));
const DropdownContentWithSpinner = withSmallSpinner(DropdownContent);

ManageUpdate.propTypes = {
    resolveUpdate: PropTypes.func.isRequired,
};

function ManageUpdate({ resolveUpdate }) {
    return (
        <>
            <span
                className="dropdown-item"
                dangerouslySetInnerHTML={{
                    __html: _(
                        `See details in <a href=${ForisURLs.packageManagement.updates}>Updates</a> page.`
                    ),
                }}
            />
            <div className="dropdown-item text-center">
                <Button
                    className="btn-primary"
                    onClick={() => resolveUpdate("grant")}
                >
                    {_("Install now")}
                </Button>
            </div>
        </>
    );
}

const withUpdateFailed = withEither(
    (props) => props.updateFailed,
    () => (
        <span className="dropdown-item text-danger">
            {_("Cannot install updates.")}
        </span>
    )
);
const ManageUpdateWithError = withUpdateFailed(ManageUpdate);
