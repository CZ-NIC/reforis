/*
 * Copyright (C) 2021 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

/* import React from "react"; */
import { Button, TextInput, useForm } from "foris";
import { useEditServers, useNTPForm } from "./hooks";

export default function NTPForm({ servers, setFormValue, formData }) {
    /*  const [serverList, setFormValue, saveServer, removeServer] = useEditServers(
        servers,
        formData
    ); */

    const [formState, /* setFormValue, */ saveServer] = useNTPForm(servers);

    /* const [formState, setFormValue, initForm] = useForm();

    function saveServer() {
        setFormValue(() => ({
            time_settings: { ntp_extras: { $push: ["něco"] } },
        }));

        const data = formState.data;
        delete data.time_settings.ntp_servers;
        if (data.time_settings.how_to_set_time === "ntp")
            delete data.time_settings.time;

        post({ data });
    } */

    /* const addS = setFormValue(() => ({
        time_settings: { ntp_extras: { $push: ["něco"] } },
    })); */

    return (
        <>
            <TextInput
                label={_("NTP Server")}
                onChange={setFormValue((value) => ({
                    /* time_settings: { ntp_extras: { $set: [value] } }, */
                    time: { $set: value },
                }))}
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
