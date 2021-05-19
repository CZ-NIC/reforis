/*
 * Copyright (C) 2021 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import diffSnapshot from "snapshot-diff";
import { cleanup, render, wait } from "foris/testUtils/customTestRender";
import mockAxios from "jest-mock-axios";
import { WebSockets } from "foris";
import { mockJSONError } from "foris/testUtils/network";

import WiFi from "../WiFi";
import { wifiFixtures } from "./__fixtures__/WiFiFixtures";
import { NO_WIFI_CARDS } from "../WiFi";

describe("<WiFi/>", () => {
    let firstRender;
    let getByText;
    let asFragment;
    const webSockets = new WebSockets();

    beforeEach(async () => {
        const renderRes = render(<WiFi ws={webSockets} />);
        asFragment = renderRes.asFragment;
        getByText = renderRes.getByText;
        mockAxios.mockResponse({ data: wifiFixtures });
        await wait(() => renderRes.getByText("Wi-Fi"));
        mockAxios.mockResponse({ data: wifiFixtures });
        await wait(() => renderRes.getByText("Wi-Fi 2"));
        firstRender = renderRes.asFragment();
    });

    it("Should handle error", async () => {
        const { getByText } = render(<WiFi ws={webSockets} />);
        mockJSONError();
        await wait(() => {
            expect(
                getByText("An error occurred while fetching data.")
            ).toBeTruthy();
        });
    });

    it("Snapshot", () => {
        expect(firstRender).toMatchSnapshot();
    });

    it("Snapshot of Alert with a warning when no modules available.", async () => {
        cleanup();
        const { getByText, asFragment } = render(<WiFi ws={webSockets} />);
        mockAxios.mockResponse({ data: { devices: [] } });
        await wait(() => getByText(NO_WIFI_CARDS));
        expect(diffSnapshot(firstRender, asFragment())).toMatchSnapshot();
    });
});
