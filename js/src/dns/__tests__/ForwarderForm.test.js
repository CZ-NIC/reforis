/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import mockAxios from "jest-mock-axios";
import userEvent from "@testing-library/user-event";
import { fireEvent, render, wait } from "foris/testUtils/customTestRender";
import { mockSetAlert } from "foris/testUtils/alertContextMock";
import { mockJSONError } from "foris/testUtils/network";
import { ALERT_TYPES } from "foris";

import ForwarderForm from "../Forwarders/Forwarder/ForwarderForm";
import { forwardersFixture } from "./__fixtures__/forwarders";

describe("<ForwarderForm/>: new forwarder.", () => {
    let getByText;
    let getByLabelText;
    let container;
    let saveForwarderCallback;

    beforeEach(() => {
        saveForwarderCallback = jest.fn();
        const renderRes = render(<ForwarderForm saveForwarderCallback={saveForwarderCallback} />);
        getByText = renderRes.getByText;
        getByLabelText = renderRes.getByLabelText;
        container = renderRes.container;
    });

    it("Test with snapshot.", () => {
        expect(container)
            .toMatchSnapshot();
    });

    it("Test add new forwarder - handle success.", async () => {
        userEvent.type(getByLabelText("Name"), "Custom forwarder");
        userEvent.type(getByLabelText("IPv4"), "1.2.3.4");
        fireEvent.click(getByText(/Save forwarder/));

        expect(mockAxios.post)
            .toBeCalled();
        const data = {
            description: "Custom forwarder",
            ipaddresses: {
                ipv4: "1.2.3.4",
                ipv6: "",
            },
            tls_type: "no",
        };
        expect(mockAxios.post)
            .toHaveBeenCalledWith("/reforis/api/dns/forwarders", data, expect.anything());
        mockAxios.mockResponse({ data: {} });

        // Handle success
        await wait(() => {
            expect(saveForwarderCallback).toBeCalled();
        });
        expect(mockSetAlert).toBeCalledWith("Forwarder saved successfully.", ALERT_TYPES.SUCCESS);
    });

    it("Test add new forwarder - handle error.", async () => {
        userEvent.type(getByLabelText("Name"), "Custom forwarder");
        userEvent.type(getByLabelText("IPv4"), "1.2.3.4");
        fireEvent.click(getByText(/Save forwarder/));
        mockJSONError();
        await wait(() => {
            expect(mockSetAlert).toBeCalledWith("Can't save forwarder.");
        });
    });
});

describe("<ForwarderForm/>: existed forwarder.", () => {
    let getByText;
    let container;
    let saveForwarderCallback;

    beforeEach(() => {
        saveForwarderCallback = jest.fn();
        const renderRes = render(
            <ForwarderForm
                forwarder={forwardersFixture.forwarders[0]}
                saveForwarderCallback={saveForwarderCallback}
            />,
        );
        getByText = renderRes.getByText;
        container = renderRes.container;
    });

    it("Test with snapshot.", () => {
        expect(container)
            .toMatchSnapshot();
    });

    it("Test add new forwarder - handle success..", async () => {
        fireEvent.click(getByText(/Save forwarder/));

        expect(mockAxios.put)
            .toBeCalled();
        const data = {
            description: "Google",
            ipaddresses: {
                ipv4: "8.8.8.8",
                ipv6: "2001:4860:4860::8888",
            },
            tls_type: "no",
        };
        expect(mockAxios.put)
            .toHaveBeenCalledWith("/reforis/api/dns/forwarders/99_google", data, expect.anything());
        mockAxios.mockResponse({ data: {} });

        // Handle success
        await wait(() => {
            expect(saveForwarderCallback).toBeCalled();
        });
        expect(mockSetAlert).toBeCalledWith("Forwarder added successfully.", ALERT_TYPES.SUCCESS);
    });

    it("Test add new forwarder - handle error.", async () => {
        fireEvent.click(getByText(/Save forwarder/));
        mockJSONError();
        await wait(() => {
            expect(mockSetAlert).toBeCalledWith("Can't add new forwarder.");
        });
    });
});
