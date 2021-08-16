/*
 * Copyright (C) 2021 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import { ALERT_TYPES, API_STATE, useAlert, useAPIPost, useForm } from "foris";
import { useEffect } from "react";
import API_URLs from "common/API";
import validator from "./validator";

const EMPTY_LEASES = {
    hostname: "",
    ip: "",
    mac: "",
};

export default function useStaticLeaseModalForm(
    saveStaticLeaseCallback,
    addNewTableItem
) {
    const [formState, setFormValue, initForm] = useForm(validator);
    const [postState, post] = useAPIPost(API_URLs.lanSetClient);
    const [setAlert, dismissAlert] = useAlert();

    useEffect(() => {
        initForm(EMPTY_LEASES);
    }, [initForm]);

    useEffect(() => {
        if (postState.state === API_STATE.SUCCESS) {
            saveStaticLeaseCallback();
            addNewTableItem(formState.data);
            initForm(EMPTY_LEASES);
            setAlert(
                _("Static lease saved successfully."),
                ALERT_TYPES.SUCCESS
            );
        } else if (postState.state === API_STATE.ERROR) {
            setAlert(_("Cannot save static lease."));
        }
    }, [postState, saveStaticLeaseCallback, initForm, setAlert]);

    function saveStaticLease() {
        dismissAlert();
        post(formState);
    }

    return [formState, setFormValue, saveStaticLease, postState];
}
