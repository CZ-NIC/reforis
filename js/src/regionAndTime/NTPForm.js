/*
 * Copyright (C) 2021 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import { Button, TextInput } from "foris";
import { useNTPForm } from "./hooks";

export default function NTPForm({ formData, setShown }) {
    const [formState, setFormValue, saveServer] = useNTPForm(
        formData,
        setShown
    );

    return (
        <>
            <TextInput
                label={_("NTP Server")}
                onChange={setFormValue((value) => ({
                    newServer: { $set: value },
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
