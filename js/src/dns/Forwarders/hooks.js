/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import { useEffect, useState } from "react";
import update from "immutability-helper";
import { useAPIGet, useWSForisModule, API_STATE } from "foris";

import API_URLs from "common/API";

const MODULE = "dns";

export default function useForwardersList(ws) {
    const [forwarders, setForwarders] = useState([]);

    const [forwardersListState, getForwardersList] = useAPIGet(
        API_URLs.dnsForwarders
    );
    useEffect(() => {
        getForwardersList();
    }, [getForwardersList]);

    useEffect(() => {
        if (forwardersListState.state === API_STATE.SUCCESS) {
            setForwarders(forwardersListState.data.forwarders || []);
        }
    }, [forwardersListState]);

    useForwardersWS(ws, setForwarders);

    return [sortForwarders(forwarders), forwardersListState.state];
}

function sortForwarders(forwarders) {
    return forwarders.sort((a, b) => {
        if (a.editable === b.editable) {
            return a.name.localeCompare(b.name);
        }
        return a.editable ? 1 : -1;
    });
}

function useForwardersWS(ws, setForwarders) {
    function useForwarderWSAction(action, func) {
        const [wsForwarderData] = useWSForisModule(ws, MODULE, action);
        useEffect(() => {
            if (wsForwarderData)
                setForwarders((forwarders) =>
                    func(forwarders, wsForwarderData)
                );
        }, [func, wsForwarderData]);
    }

    useForwarderWSAction("add_forwarder", addForwarder);
    useForwarderWSAction("set_forwarder", setForwarder);
    useForwarderWSAction("del_forwarder", deleteForwarder);
}

function addForwarder(forwarders, forwarder) {
    return update(forwarders, { $push: [{ editable: true, ...forwarder }] });
}

function setForwarder(forwarders, forwarder) {
    const forwarderIndex = forwarders.findIndex(
        (fwd) => fwd.name === forwarder.name
    );
    return update(forwarders, {
        $splice: [[forwarderIndex, 1, { editable: true, ...forwarder }]],
    });
}

function deleteForwarder(forwarders, forwarder) {
    const forwarderIndex = forwarders.findIndex(
        (fwd) => fwd.name === forwarder.name
    );
    return update(forwarders, { $splice: [[forwarderIndex, 1]] });
}
