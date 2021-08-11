/*
 * Copyright (C) 2019-2021 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import { useEffect, useState } from "react";

import { useAPIPost, useForm } from "foris";
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

export function useEditServers(servers, formData) {
    /*  const [formState, setFormValue, initForm] = useForm(); */
    const [serverList, setServers] = useState(servers.ntp_extras); //rename setServers?
    const [postState, post] = useAPIPost(API_URLs.regionAndTime);

    /* function saveServer() {
        setFormValue(() => ({
            ntp_servers: { neco: { $push: [""] }},
        }))};

        const data = formState.data;
        delete data.time_settings.ntp_servers;
        if (data.time_settings.how_to_set_time === "ntp")
            delete data.time_settings.time;

        post({ data });
    } */

    function removeServer(serverToRemove) {
        setServers((servers) =>
            servers.filter((server) => {
                return server !== serverToRemove;
            })
        );
    }

    return [
        /* setFormValue, formState,  */ serverList,
        /* saveServer, */
        removeServer,
    ];
}

export function useNTPForm(formData) {
    const [formState, setFormValue, initForm] = useForm(validator);
    const [postState, post] = useAPIPost(API_URLs.regionAndTime);
    console.log("formState.data", formState.data);

    useEffect(() => {
        if (formData) {
            initForm(formData);
        }
    }, [formData]);

    function saveServer() {
        const data = formState.data;

        data.time_settings.ntp_extras.push(data.newServer);
        delete data.newServer;
        delete data.time_settings.ntp_servers;
        if (data.time_settings.how_to_set_time === "ntp")
            delete data.time_settings.time;

        post({ data });
    }
    return [formState, setFormValue, saveServer];
}

function validator() {
    const errors = {};
    return errors;
}
