/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import { useEffect, useState } from "react";
import update from "immutability-helper";
import {
    useAPIGet, useAPIPost, useForm, useWSForisModule,
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

export function useForwarderForm(forwarder) {
    const [formState, setFormValue, initForm] = useForm(validator);
    useEffect(() => {
        initForm(forwarder || EMPTY_FORWARDER);
    }, [forwarder, initForm]);

    const [postState, post] = useAPIPost(API_URLs.dnsForwarder);
    const [, postDeleteForwarder] = useAPIPost(API_URLs.dnsDeleteForwarder);

    function saveForwarder() {
        if (forwarder && forwarder.name !== formState.data.name) {
            postDeleteForwarder({ name: forwarder.name });
        }
        post(prepDataToSubmit(formState.data));
        if (!forwarder) initForm(EMPTY_FORWARDER);
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
    const fieldsToUnset = ["editable"].concat(tlsUnsetRules[forwarder.tls_type]);

    return update(forwarder, { $unset: fieldsToUnset });
}

const MODULE = "dns";

export function useForwardersList(ws) {
    const [forwarders, setForwarders] = useState([]);

    const [forwardersListState, getForwardersList] = useAPIGet(API_URLs.dnsForwarders);
    useEffect(() => {
        getForwardersList();
    }, [getForwardersList]);

    useEffect(() => {
        if (forwardersListState.data) {
            const forwardersDict = forwardersListToDict(forwardersListState.data.forwarders);
            setForwarders(forwardersDict);
        }
    }, [forwardersListState]);

    const [wsForwarderSetData] = useWSForisModule(ws, MODULE, "set_forwarder");
    useEffect(() => {
        if (wsForwarderSetData) setForwarders((fwds) => updateForwarder(fwds, wsForwarderSetData));
    }, [wsForwarderSetData]);

    const [wsForwarderDelData] = useWSForisModule(ws, MODULE, "del_forwarder");
    useEffect(() => {
        if (wsForwarderDelData) setForwarders((fwds) => deleteForwarder(fwds, wsForwarderDelData));
    }, [wsForwarderDelData]);

    return [forwardersDictToList(forwarders), forwardersListState.isLoading];
}

function forwardersListToDict(forwardersList) {
    return forwardersList.reduce(
        (dict, forwarder) => {
            dict[forwarder.name] = forwarder;
            delete dict[forwarder.name].name;
            return dict;
        }, {},
    );
}

function forwardersDictToList(forwardersDict) {
    const forwardersList = [];
    Object.keys(forwardersDict)
        .forEach((key) => {
            forwardersList.push({ name: key, ...forwardersDict[key] });
        });
    return forwardersList;
}

function updateForwarder(forwarders, forwarder) {
    return update(forwarders, { [forwarder.name]: { $set: { editable: true, ...forwarder } } });
}

function deleteForwarder(forwarders, forwarder) {
    return update(forwarders, { $unset: [forwarder.name] });
}
