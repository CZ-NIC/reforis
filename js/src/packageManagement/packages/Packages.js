/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { ForisForm } from "foris";

import API_URLs from "common/API";
import PackagesForm from "./PackagesForm";
import DisableIfUpdaterIsDisabled from "../utils/DisableIfUpdaterIsDisabled";

export default function Packages() {
    return (
        <>
            <h1>{_("Packages")}</h1>
            <p>
                {_(`
Apart from the standard installation, you can optionally select bundles of additional software that'd be installed on 
the router. This software can be selected from the following list. Please note that only software that is part of 
TurrisOS or that has been installed from a package list and not marked as community-supported is actually supported
by Turris team.
        `)}
            </p>
            <ForisForm
                forisConfig={{ endpoint: API_URLs.packages }}
                prepData={prepData}
                prepDataToSubmit={prepDataToSubmit}
                validator={validator}
            >
                <DisableIfUpdaterIsDisabled>
                    <PackagesForm />
                </DisableIfUpdaterIsDisabled>
            </ForisForm>
        </>
    );
}

function prepData(formData) {
    formData.package_lists = formData.package_lists.filter(
        (_package) => !_package.hidden
    );
    return formData;
}

function prepDataToSubmit(formData) {
    const packages = formData.package_lists
        .filter((_package) => _package.enabled)
        .map((_package) => {
            const options = _package.options.map((option) => ({
                name: option.name,
                enabled: option.enabled,
            }));
            return {
                name: _package.name,
                options,
            };
        });

    return {
        package_lists: packages,
    };
}

// Hack to disable submit button
function validator(formData) {
    if (!formData.enabled) return { enabled: true };
    return null;
}
