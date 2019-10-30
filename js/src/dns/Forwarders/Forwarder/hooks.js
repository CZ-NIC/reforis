/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import { useEffect } from "react";
import update from "immutability-helper";
import {
    useAlert, useAPIPatch, useAPIPost, useForm,
} from "foris";
import API_URLs from "common/API";
import validator from "./validator";

const EMPTY_FORWARDER = {
    name: "",
    description: "",
    ipaddresses: {
        ipv4: "",
        ipv6: "",
    },
    tls_type: "no",
};

export default function useForwarderForm(forwarder, saveForwarderCallback) {
    const [formState, setFormValue, initForm] = useForm(validator);
    const [postState, post] = useAPIPost(API_URLs.dnsForwarders);
    const [patchState, patch] = useAPIPatch(`${API_URLs.dnsForwarders}/${(forwarder || {}).name}`);

    const [setAlert] = useAlert();

    useEffect(() => {
        if (postState.isSuccess) {
            setAlert(null);
            saveForwarderCallback();
            initForm(EMPTY_FORWARDER);
        } else if (postState.isError) {
            setAlert(_("Can't save forwarder."));
        }
    }, [setAlert, postState, initForm, saveForwarderCallback]);

    useEffect(() => {
        if (patchState.isSuccess) {
            setAlert(null);
            saveForwarderCallback();
        } else if (patchState.isError) {
            setAlert(_("Can't add new forwarder."));
        }
    }, [patchState, saveForwarderCallback, setAlert]);

    useEffect(() => {
        if (forwarder) initForm(forwarder);
        else initForm(EMPTY_FORWARDER);
    }, [forwarder, initForm]);

    function saveForwarder() {
        if (forwarder) patch(prepDataToSubmit(formState.data));
        else post(prepDataToSubmit(formState.data));
    }

    return [
        formState,
        setFormValue,
        postState,
        saveForwarder,
    ];
}

function prepDataToSubmit(forwarder) {
    const tlsUnsetRules = {
        no: ["tls_hostname", "tls_pin"],
        hostname: ["tls_pin"],
        pin: ["tls_hostname"],
    };
    const fieldsToUnset = ["name", "editable"].concat(tlsUnsetRules[forwarder.tls_type]);

    return update(forwarder, { $unset: fieldsToUnset });
}
