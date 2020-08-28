/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import Overview, { displayCard } from "../Overview";
import { WebSockets } from "foris";
import mockAxios from "jest-mock-axios";
import {
    packageListsFixture,
    dataCollectionCardFixture,
    automaticUpdatesCardFixture,
    netmetrCardFixture,
    openVPNClientsCardFixture,
} from "./__fixtures__/overview";
import { notificationsFixture } from "../../notifications/__tests__/__fixtures__/notifications";
import { render, wait, getByText } from "foris/testUtils/customTestRender";

describe("Overview", () => {
    let overviewContainer;

    it("Snapshot of the whole page", async () => {
        const webSockets = new WebSockets();
        const { container } = render(<Overview ws={webSockets} />);

        mockAxios.mockResponse({ data: packageListsFixture });
        await wait(() => getByText(container, "Overview"));

        mockAxios.mockResponse({ data: automaticUpdatesCardFixture });
        await wait(() => getByText(container, "Automatic Updates"));

        mockAxios.mockResponse({ data: dataCollectionCardFixture });
        await wait(() => getByText(container, "Data Collection"));

        mockAxios.mockResponse({ data: netmetrCardFixture });
        await wait(() => getByText(container, "NetMetr"));

        mockAxios.mockResponse({ data: openVPNClientsCardFixture });
        await wait(() => getByText(container, "OpenVPN Clients"));

        mockAxios.mockResponse({ data: notificationsFixture });
        await wait(() => getByText(container, "Dismiss all"));
        overviewContainer = container;
        expect(overviewContainer).toMatchSnapshot();
    });

    it("Should display given cards", () => {
        expect(displayCard(packageListsFixture, "datacollect")).toBe(true);
    });

    it("Should display given options", () => {
        expect(displayCard(packageListsFixture, "dynfw")).toBe(true);
    });
});
