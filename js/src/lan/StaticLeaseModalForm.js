/*
 * Copyright (C) 2021 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import { API_STATE, Button, Spinner, TextInput } from "foris";
import useStaticLeaseModalForm from "./hooks";

export default function StaticLeaseModalForm({
    saveStaticLeaseCallback,
    addNewTableItem,
}) {
    const [
        formState,
        setFormValue,
        saveStaticLease,
        postState,
    ] = useStaticLeaseModalForm(saveStaticLeaseCallback, addNewTableItem);

    if (!formState.data) return <Spinner className="text-center" />;

    const formErrors = formState.errors || {};
    const disabled = postState.state === API_STATE.SENDING;

    return (
        <>
            <TextInput
                label={_("Hostname")}
                value={formState.data.hostname}
                error={formErrors.hostname}
                onChange={setFormValue((value) => ({
                    hostname: { $set: value },
                }))}
                disabled={disabled}
            />
            <TextInput
                label={_("IPv4 address")}
                value={formState.data.ip}
                error={formErrors.ip}
                onChange={setFormValue((value) => ({
                    ip: { $set: value },
                }))}
                disabled={disabled}
            />
            <TextInput
                label={_("MAC address")}
                value={formState.data.mac}
                error={formErrors.mac}
                onChange={setFormValue((value) => ({
                    mac: { $set: value },
                }))}
                disabled={disabled}
            />
            <Button
                className="btn-primary col-lg-12 col-md-12"
                onClick={saveStaticLease}
                disabled={!!formState.errors}
            >
                {_("Save")}
            </Button>
        </>
    );
}
