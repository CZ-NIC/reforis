/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import {fireEvent, getByLabelText, getByText, render, wait} from "foris/testUtils/customTestRender";

import { WebSockets } from "foris";
import { mockJSONError } from "foris/testUtils/network";
import mockAxios from "jest-mock-axios";
import GuestNetwork from "../GuestNetwork";
import guestNetworkFixture from "./__fixtures__/guestNetwork";


describe("<GuestNetwork/>", () => {
    let guestNetworkContainer;

    beforeEach(async () => {
        const webSockets = new WebSockets();
        const { container } = render(<GuestNetwork ws={webSockets} setFormValue={() => {}}/>);
        mockAxios.mockResponse({data: guestNetworkFixture()});
        await wait(() => getByLabelText(container, "Enable"));
        guestNetworkContainer = container
    });

    it("should handle error", async () => {
        const webSockets = new WebSockets();
        const { getByText } = render(<GuestNetwork ws={webSockets} setFormValue={() => {}}/>);
        mockJSONError();
        await wait(() => {
            expect(getByText("An error occurred while fetching data.")).toBeTruthy();
        });
    });

    it("Snapshot disabled.", () => {
        expect(guestNetworkContainer).toMatchSnapshot();
    });

    it("Snapshot enabled.", () => {
        fireEvent.click(getByText(guestNetworkContainer, "Enable"));
        expect(guestNetworkContainer).toMatchSnapshot();
    });

    it("Snapshot enabled DHCP.", () => {
        fireEvent.click(getByText(guestNetworkContainer, "Enable"));
        fireEvent.click(getByText(guestNetworkContainer, "Enable DHCP"));
        expect(guestNetworkContainer).toMatchSnapshot();
    });

    it("Snapshot enabled QoS.", () => {
        fireEvent.click(getByText(guestNetworkContainer, "Enable"));
        fireEvent.click(getByText(guestNetworkContainer, "Enable QoS"));
        expect(guestNetworkContainer).toMatchSnapshot();
    });

    it("Test post.", async () => {
        fireEvent.click(getByText(guestNetworkContainer, "Enable"));
        fireEvent.click(getByText(guestNetworkContainer, "Enable DHCP"));
        fireEvent.click(getByText(guestNetworkContainer, "Enable QoS"));
        fireEvent.click(getByText(guestNetworkContainer, "Save"));

        expect(mockAxios.post).toBeCalled();
        const data = {
            "dhcp": {
                "enabled": true,
                "lease_time": 3600,
                "limit": 150,
                "start": 100,
            },
            "enabled": true,
            "ip": "10.111.222.1",
            "netmask": "255.255.255.0",
            "qos": {
                "enabled": true,
                "download": 1023,
                "upload": 1025,
            },
        };
        expect(mockAxios.post).toHaveBeenCalledWith("/reforis/api/guest-network", data, expect.anything());
    });
});
