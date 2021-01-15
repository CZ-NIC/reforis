/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";
import { CheckBox, ForisURLs } from "foris";

SyslogForm.defaultProps = {
    formErrors: {},
};

SyslogForm.propTypes = {
    formErrors: PropTypes.shape({
        noDiskMounted: PropTypes.string,
    }),
    formData: PropTypes.shape({
        persistent_logs: PropTypes.bool,
    }),
    setFormValue: PropTypes.func,
};

export default function SyslogForm({ formData, setFormValue, formErrors }) {
    return (
        <>
            <h2>{_(`System logs retention`)}</h2>
            <p
                dangerouslySetInnerHTML={{
                    __html: _(
                        `During device reboot, system logs are lost by default. This option allows to save system logs using Storage plugin. Logs are saved into /srv/log/messages. To enable this option, you have to configure a storage in the <a href="${ForisURLs.storage}" title="Go to Storage plugin">Storage plugin</a> first.`
                    ),
                }}
            />
            <CheckBox
                label={_("Enable system logs retention")}
                disabled={!!formErrors.noDiskMounted}
                checked={formData.persistent_logs}
                onChange={setFormValue((value) => ({
                    persistent_logs: { $set: value },
                }))}
            />
        </>
    );
}
