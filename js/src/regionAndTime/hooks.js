/*
 * Copyright (C) 2019-2021 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import { useEffect, useState } from "react";

import { useAPIPost } from "foris";
import API_URLs from "common/API";

export function useNTPDate(ws) {
    const [state, setState] = useState({
        data: null,
        id: null,
        isLoading: false,
    });

    const [updateTimeState, updateTime] = useAPIPost(API_URLs.ntpUpdate);
    useEffect(() => {
        if (updateTimeState.data) {
            setState((prevState) => ({
                ...prevState,
                id: updateTimeState.data.id,
            }));
        }
    }, [updateTimeState.data]);

    function trigger() {
        setState((previousState) => ({ ...previousState, isLoading: true }));
        updateTime();
    }

    useEffect(() => {
        const module = "time";
        ws.subscribe(module)
            .bind(module, "ntpdate_started", (msg) => {
                if (state.id === msg.data.id) {
                    setState((prevState) => ({
                        ...prevState,
                        isLoading: true,
                    }));
                }
            })
            .bind(module, "ntpdate_finished", (msg) => {
                if (state.id === msg.data.id) {
                    setState((prevState) => ({
                        ...prevState,
                        isLoading: false,
                        data: { time: msg.data.time, result: msg.data.result },
                    }));
                }
            });
    }, [state.id, ws]);

    return [state, trigger];
}

export function useEditServers(servers) {
    const [serverList, setServers] = useState(servers.ntp_extras);

    function addServer() {
        //function for adding new server
    }

    function removeServer(serverToRemove) {
        setServers((servers) =>
            servers.filter((server) => {
                return server !== serverToRemove;
            })
        );
    }

    function resetToDefaultList() {
        /* setToDefault({ data: postData }); */
    }

    return [serverList, addServer, removeServer, resetToDefaultList];
}
