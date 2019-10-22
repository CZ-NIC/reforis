/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import mockAxios from "jest-mock-axios";
import userEvent from "@testing-library/user-event";
import { AlertContextProvider } from "foris";
import { fireEvent, render } from "customTestRender";

import ForwarderForm from "../Forwarders/Forwarder/ForwarderForm";
import { forwardersFixture } from "./__fixtures__/forwarders";

describe("<ForwarderForm/>: new forwarder.", () => {
    let getByText;
    let getByLabelText;
    let container;
    let saveForwarderCallback;

    beforeEach(() => {
        saveForwarderCallback = jest.fn();
        const renderRes = render(
            <AlertContextProvider>
                <ForwarderForm saveForwarderCallback={saveForwarderCallback}/>
            </AlertContextProvider>
        );
        getByText = renderRes.getByText;
        getByLabelText = renderRes.getByLabelText;
        container = renderRes.container;
    });

    it("Test with snapshot.", () => {
        expect(container)
            .toMatchSnapshot();
    });

    it("Test add new forwarder.", async () => {
        userEvent.type(getByLabelText("Name"), "Custom forwarder");
        userEvent.type(getByLabelText("IPv4"), "1.2.3.4");
        fireEvent.click(getByText(/Save forwarder/));

        expect(mockAxios.post)
            .toBeCalled();
        const data = {
            "description": "Custom forwarder",
            "ipaddresses": {
                "ipv4": "1.2.3.4",
                "ipv6": "",
            },
            "tls_type": "no",
        };
        expect(mockAxios.post)
            .toHaveBeenCalledWith("/api/dns/forwarders", data, expect.anything());
    });
});

describe("<ForwarderForm/>: existed forwarder.", () => {
    let getByText;
    let getByLabelText;
    let container;
    let saveForwarderCallback;

    beforeEach(() => {
        saveForwarderCallback = jest.fn();
        const renderRes = render(
            <AlertContextProvider>
                <ForwarderForm
                    forwarder={forwardersFixture.forwarders[0]}
                    saveForwarderCallback={saveForwarderCallback}
                />
            </AlertContextProvider>
        );
        getByText = renderRes.getByText;
        getByLabelText = renderRes.getByLabelText;
        container = renderRes.container;
    });

    it("Test with snapshot.", () => {
        expect(container)
            .toMatchSnapshot();
    });

    it("Test add new forwarder.", async () => {
        fireEvent.click(getByText(/Save forwarder/));

        expect(mockAxios.patch)
            .toBeCalled();
        const data = {
            "description": "Google",
            "ipaddresses": {
                "ipv4": "8.8.8.8",
                "ipv6": "2001:4860:4860::8888",
            },
            "tls_type": "no",
        };
        expect(mockAxios.patch)
            .toHaveBeenCalledWith("/api/dns/forwarders/99_google", data, expect.anything());
    });
});
