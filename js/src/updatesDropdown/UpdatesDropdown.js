/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect } from "react";

import {
    ForisURLs, useAPIGet, useAPIPost, SpinnerElement,
} from "foris";
import API_URLs from "common/API";

import isUpdateAvailable from "packageManagement/updates/utils";

export default function UpdatesDropdown() {
    const [getState, get] = useAPIGet(API_URLs.approvals);
    const [postState, post] = useAPIPost(API_URLs.approvals);

    const approval = getState.data;

    function handleUpdate(solution) {
        return (event) => {
            event.preventDefault();
            post({ hash: approval.hash, solution });
        };
    }

    useEffect(() => {
        get();
    }, [get, postState.data]);

    if (getState.isLoading) {
        return (
            <div className="dropdown" id="updates-dropdown">
                <button type="button" className="nav-item btn btn-link">
                    <SpinnerElement small />
                </button>
            </div>
        );
    }

    if (!isUpdateAvailable(approval)) {
        return null;
    }

    return (
        <div className="dropdown">
            <button type="button" className="nav-item btn btn-link">
                <i className="fa fa-sync fa-lg" />
            </button>
            <div className="dropdown-menu">
                <div className="dropdown-header">
                    <h5>{_("Approve update")}</h5>
                </div>
                <div className="dropdown-divider" />
                <p
                    className="dropdown-item"
                    dangerouslySetInnerHTML={{ __html: _(`See details in <a href=${ForisURLs.packageManagement.updates}>Updates</a> page.`) }}
                />
                <div className="dropdown-item" id="updates-dropdown-actions">
                    <button type="button" className="btn btn-warning mr-3" onClick={handleUpdate("deny")}>{_("Deny")}</button>
                    <button type="button" className="btn btn-primary" onClick={handleUpdate("grant")}>{_("Install now")}</button>
                </div>
            </div>
        </div>
    );
}
