/*
 * Copyright (C) 2021 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import { DownloadButton, formFieldsSize } from "foris";

import API_URLs from "../../common/API";

export default function ConfigurationBackup() {
    // TODO: - create a backup endpoint
    //       - pull on created endpoint
    //       - treat disabled state

    const disabled = false;

    return (
        <div className={formFieldsSize}>
            <h2>{_(`Configuration Backup`)}</h2>
            <p>
                {_(`If you need to save the current configuration of this \
device, you can download a backup file. The configuration is saved as an \
unencrypted compressed archive (.tar.bz2). Passwords for this configuration \
interface and for the advanced configuration are not included in the backup.`)}
            </p>
            <div className="text-right">
                <DownloadButton
                    href={API_URLs.backupEndpoint}
                    className={`btn-primary col-sm-12 col-md-3 col-lg-2 ${
                        disabled ? "disabled" : ""
                    }`.trim()}
                >
                    {_("Download")}
                </DownloadButton>
            </div>
        </div>
    );
}
