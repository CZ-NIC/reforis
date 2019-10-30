/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect } from "react";

import {
    ForisURLs, useAPIGet, useAPIPost, SpinnerElement, Button,
} from "foris";
import API_URLs from "common/API";

export default function UpdatesDropdown() {
    const [getState, get] = useAPIGet(API_URLs.approvals);
    const update = getState.data;
    useEffect(() => {
        get();
    }, [get]);

    const [postState, post] = useAPIPost(API_URLs.approvals);
    // Reload approvals when resolution is successful
    useEffect(() => {
        if (postState.isSuccess) {
            get();
        }
    }, [get, postState]);

    function resolveUpdate(solution) {
        post({ hash: update.hash, solution });
    }

    if (getState.isLoading || !update) {
        return (
            <div className="dropdown" id="updates-dropdown">
                <button type="button" className="nav-item btn btn-link">
                    <SpinnerElement small />
                </button>
            </div>
        );
    }

    if (!update.approvable) {
        return null;
    }

    let hasError = false;
    let dropdownContent;
    if (postState.isError) {
        hasError = true;
        dropdownContent = <span className="dropdown-item text-danger">{_("Cannot resolve update")}</span>;
    } else {
        dropdownContent = (
            <>
                <span
                    className="dropdown-item"
                    dangerouslySetInnerHTML={{ __html: _(`See details in <a href=${ForisURLs.packageManagement.updates}>Updates</a> page.`) }}
                />
                <div className="dropdown-item" id="updates-dropdown-actions">
                    <Button className="btn-warning mr-3" onClick={() => resolveUpdate("deny")}>{_("Ignore")}</Button>
                    <Button className="btn-primary" onClick={() => resolveUpdate("grant")}>{_("Install now")}</Button>
                </div>
            </>
        );
    }

    return (
        <div className="dropdown">
            <button type="button" className="nav-item btn btn-link">
                <i className={`fa fa-sync fa-lg ${hasError ? "text-danger" : ""}`.trim()} />
            </button>
            <div className="dropdown-menu">
                <div className="dropdown-header">
                    <h5>{_("Approve update")}</h5>
                </div>
                <div className="dropdown-divider" />
                {dropdownContent}
            </div>
        </div>
    );
}
