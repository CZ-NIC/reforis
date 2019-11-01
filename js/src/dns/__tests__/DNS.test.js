/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import { fireEvent, render, wait, waitForElement } from "foris/testUtils/customTestRender";
import diffSnapshot from "snapshot-diff";
import mockAxios from "jest-mock-axios";
import { WebSockets } from "foris";

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

    it("Test with snapshot.", () => {
        expect(firstRender)
            .toMatchSnapshot();
    });

    it("Test with snapshot forwarding.", async () => {
        fireEvent.click(getByLabelText("Use forwarding"));
        mockAxios.mockResponse({ data: forwardersFixture });
        await waitForElement(() => getByLabelText(/Custom forwarder/));
        expect(diffSnapshot(firstRender, asFragment()))
            .toMatchSnapshot();
    });

    it("Test with snapshot DHCP.", () => {
        fireEvent.click(getByLabelText("Enable DHCP clients in DNS"));
        expect(diffSnapshot(firstRender, asFragment()))
            .toMatchSnapshot();
    });

    it("Test post.", () => {
        fireEvent.click(getByLabelText("Use forwarding"));
        fireEvent.click(getByLabelText("Enable DHCP clients in DNS"));
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
            .toHaveBeenCalledWith("/api/dns", data, expect.anything());
    });
});
