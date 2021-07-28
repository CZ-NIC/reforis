/*
 * Copyright (C) 2021 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect } from "react";
import {
    // API_STATE,
    Button,
    FileInput,
    formFieldsSize,
    buttonFormFieldsSize,
    // useAPIPost,
    // useAlert,
    useForm,
} from "foris";

// import API_URLs from "../../common/API";

export default function ConfigurationRestore() {
    // TODO: - create restore endpoint
    //       - pull logic on created endpoint

    // const [setAlert] = useAlert();
    // const [postSettingsResponse, postSettings] = useAPIPost(
    //     API_URLs.restoreEndpoint,
    //     "multipart/form-data"
    // );
    // useEffect(() => {
    //     if (postSettingsResponse.state === API_STATE.ERROR) {
    //         setAlert(postSettingsResponse.data);
    //     }
    // }, [postSettingsResponse.data, postSettingsResponse.state, setAlert]);

    const [formState, formChangeHandler, reloadForm] = useForm(validator);
    const formData = formState.data;
    const formErrors = formState.errors || {};
    useEffect(() => {
        reloadForm({ settings: undefined });
    }, [reloadForm]);

    function handleSubmit(event) {
        event.preventDefault();
        const postData = new FormData();
        postData.append("settings", formData.settings);
        // postSettings({ data: postData });
    }

    if (!formData) {
        return null;
    }

    return (
        <div className={formFieldsSize}>
            <h2>{_(`Configuration Restore`)}</h2>
            <p>
                {_(`To restore the configuration from a backup file, upload it \
using following form. Keep in mind that IP address of this device might change \
during the process, causing unavailability of this interface.`)}
            </p>
            <form onSubmit={handleSubmit} className="col px-0">
                <FileInput
                    label={
                        formData.settings
                            ? formData.settings.name
                            : _("Choose backup file...")
                    }
                    files={[formData.settings]}
                    error={formErrors.settings}
                    onChange={formChangeHandler((value) => ({
                        settings: { $set: value },
                    }))}
                    accept=".tar.bz2"
                />
                <div className={`${buttonFormFieldsSize} text-right`}>
                    <Button
                        type="submit"
                        forisFormSize
                        disabled={formErrors.settings || !formData.settings}
                    >
                        {_("Restore")}
                    </Button>
                </div>
            </form>
        </div>
    );
}

function validator(formData) {
    // Ignore empty file - submit will be disabled anyways
    if (!formData.settings) {
        return undefined;
    }

    if (formData.settings.size > 1024 * 1024) {
        return { settings: _("File is too big. Maximum size is 1 MB") };
    }

    const filename = formData.settings.name;

    if (filename.length === 0 || filename.length > 50) {
        return {
            settings: _(
                "Filename must be at least 1 and at most 50 characters long."
            ),
        };
    }

    if (!/^[a-zA-Z0-9_.-]*$/.test(filename)) {
        return {
            settings: _(
                `Filename can contain only alphanumeric characters, dots, dashes and underscores.`
            ),
        };
    }

    return undefined;
}
