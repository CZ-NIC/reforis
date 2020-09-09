/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import { ForisForm } from "foris";

import API_URLs from "common/API";
import DisableIfUpdaterIsDisabled from "../utils/DisableIfUpdaterIsDisabled";
import LanguagesForm from "./LanguagesForm";

export default function Languages() {
    return (
        <>
            <h1>{_("Languages")}</h1>
            <p>
                {_(
                    "If you want to use another language than English you can select it from the following list:"
                )}
            </p>
            <ForisForm
                forisConfig={{ endpoint: API_URLs.languagePackages }}
                prepDataToSubmit={prepDataToSubmit}
                validator={validator}
            >
                <DisableIfUpdaterIsDisabled>
                    <LanguagesForm />
                </DisableIfUpdaterIsDisabled>
            </ForisForm>
        </>
    );
}

function prepDataToSubmit(formData) {
    const languages = formData.languages
        .filter((language) => language.enabled)
        .map((language) => language.code);

    return { languages };
}

// Hack to disable submit button
function validator(formData) {
    if (!formData.enabled) return { enabled: true };
    return null;
}
