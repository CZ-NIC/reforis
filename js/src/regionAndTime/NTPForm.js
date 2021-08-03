/*
 * Copyright (C) 2021 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

/* import React from "react"; */
import { Button, TextInput } from "foris";
import { useEditServers } from "./hooks";

export default function NTPForm({ servers, formData }) {
    const [serverList, setFormValue, saveServer, removeServer] = useEditServers(
        servers,
        formData
    );

    return (
        <>
            <TextInput
                label={_("NTP Server")}
                /* onChange={setFormValue((value) => ({
                    ntp_servers: { $push: [value] },
                }))} */
            />
            <Button
                onClick={saveServer}
                forisFormSize
                className="btn-primary col-lg-12 col-md-12"
            >
                {_("Save")}
            </Button>
        </>
    );
}
