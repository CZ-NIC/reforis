/*
 * Copyright (C) 2020-2021 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import { ForisURLs } from "foris";
import ReactTooltip from "react-tooltip";

export default function LogoutButton() {
    function logout() {
        window.location.replace(ForisURLs.logout);
    }

    return (
        <div>
            <ReactTooltip id="logout" place="bottom">
                <span>{_("Logout")}</span>
            </ReactTooltip>
            <button
                className="nav-item btn btn-link"
                type="button"
                onClick={logout}
                data-tip
                data-for="logout"
                data-arrow-color="transparent"
            >
                <i className="fas fa-sign-out-alt fa-lg" />
            </button>
        </div>
    );
}
