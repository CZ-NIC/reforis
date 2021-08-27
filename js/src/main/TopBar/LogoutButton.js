/*
 * Copyright (C) 2020-2021 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect } from "react";
import { API_STATE, ForisURLs, useAPIPost } from "foris";
import ReactTooltip from "react-tooltip";

import API_URLs from "common/API";

export default function LogoutButton() {
    const [logout, postLogout] = useAPIPost(API_URLs.logout);

    useEffect(() => {
        if (logout.state === API_STATE.SUCCESS) {
            window.location.replace(ForisURLs.logout);
        }
    }, [logout.state]);
    return (
        <div>
            <ReactTooltip id="logout" place="bottom">
                <span>{_("Logout")}</span>
            </ReactTooltip>
            <button
                className="nav-item btn btn-link"
                type="button"
                onClick={postLogout}
                data-tip
                data-for="logout"
                data-arrow-color="transparent"
            >
                <i className="fas fa-sign-out-alt fa-lg" />
            </button>
        </div>
    );
}
