/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import diffSnapshot from "snapshot-diff";
import mockAxios from "jest-mock-axios";

import { fireEvent, render, wait, waitForElement } from "foris/testUtils/customTestRender";
import { WebSockets } from "foris";
import { mockJSONError } from "foris/testUtils/network";

import { dnsFixture } from "./__fixtures__/dns";
import { forwardersFixture } from "./__fixtures__/forwarders";

import DNS from "../DNS";

describe("<DNS/>", () => {
    let firstRender;
    let asFragment;
    let getByText;
    let getByLabelText;

    beforeEach(async () => {
        const webSockets = new WebSockets();
        const renderRes = render(<DNS ws={webSockets}/>);
        mockAxios.mockResponse({ data: dnsFixture });
        getByText = renderRes.getByText;
        getByLabelText = renderRes.getByLabelText;
        asFragment = renderRes.asFragment;

        await wait(() => renderRes.getByLabelText(/Use forwarding/));
        firstRender = renderRes.asFragment();
    });

    it("should handle error", async () => {
        const webSockets = new WebSockets();
        const { getByText } = render(<DNS ws={webSockets}/>);
        mockJSONError();
        await wait(() => {
            expect(getByText("An error occurred while fetching data.")).toBeTruthy();
        });
    });

    it("Test with snapshot.", () => {
        expect(firstRender).toMatchSnapshot();
    });

    it("Test with snapshot forwarding.", async () => {
        fireEvent.click(getByText("Use forwarding"));
        mockAxios.mockResponse({ data: forwardersFixture });
        await waitForElement(() => getByLabelText(/Custom forwarder/));
        expect(diffSnapshot(firstRender, asFragment()))
            .toMatchSnapshot();
    });

    it("Test with snapshot DHCP.", () => {
        fireEvent.click(getByText("Enable DHCP clients in DNS"));
        expect(diffSnapshot(firstRender, asFragment()))
            .toMatchSnapshot();
    });

    it("Test post.", () => {
        fireEvent.click(getByText("Use forwarding"));
        fireEvent.click(getByText("Enable DHCP clients in DNS"));
        fireEvent.click(getByText("Save"));

        expect(mockAxios.post)
            .toBeCalled();
        const data = {
            "dns_from_dhcp_domain": "lan",
            "dns_from_dhcp_enabled": true,
            "dnssec_enabled": true,
            "forwarder": "",
            "forwarding_enabled": true
        };
        expect(mockAxios.post)
            .toHaveBeenCalledWith("/reforis/api/dns", data, expect.anything());
    });
});
