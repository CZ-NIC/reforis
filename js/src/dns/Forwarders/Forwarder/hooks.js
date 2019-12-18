/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import { useEffect } from "react";
import update from "immutability-helper";
import {
    useAlert, useAPIPut, useAPIPost, useForm, API_STATE, ALERT_TYPES,
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
    const [putState, put] = useAPIPut(`${API_URLs.dnsForwarders}/${(forwarder || {}).name}`);

    const [setAlert, dismissAlert] = useAlert();

    useEffect(() => {
        if (postState.state === API_STATE.SUCCESS) {
            saveForwarderCallback();
            initForm(EMPTY_FORWARDER);
            setAlert(_("Forwarder saved successfully."), ALERT_TYPES.SUCCESS);
        } else if (postState.state === API_STATE.ERROR) {
            setAlert(_("Can't save forwarder."));
        }
    }, [setAlert, postState, initForm, saveForwarderCallback]);

    useEffect(() => {
        if (putState.state === API_STATE.SUCCESS) {
            saveForwarderCallback();
            setAlert(_("Forwarder added successfully."), ALERT_TYPES.SUCCESS);
        } else if (putState.state === API_STATE.ERROR) {
            setAlert(_("Can't add new forwarder."));
        }
    }, [putState, saveForwarderCallback, setAlert]);

    useEffect(() => {
        if (forwarder) {
            initForm(forwarder);
        } else {
            initForm(EMPTY_FORWARDER);
        }
    }, [forwarder, initForm]);

    function saveForwarder() {
        const data = prepDataToSubmit(formState.data);
        dismissAlert();
        if (forwarder) {
            put({ data });
        } else {
            post({ data });
        }
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
