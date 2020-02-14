/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import { render, wait } from "foris/testUtils/customTestRender";
import mockAxios from "jest-mock-axios";

import { WebSockets } from "foris";
import { notificationsFixture } from "notifications/__tests__/__fixtures__/notifications.js";

import RebootDropdown from "../RebootDropdown";

describe("<RebootDropdown/>", () => {
    let rebootDropdownContainer;

    beforeEach(async () => {
        const webSockets = new WebSockets();
        const { container, getByText } = render(<RebootDropdown ws={webSockets} />);
        mockAxios.mockResponse({ data: notificationsFixture });
        rebootDropdownContainer = container;
        await wait(() => {
            getByText("Reboot Required");
        });
    });

    it("Test with snapshot", () => {
        expect(rebootDropdownContainer).toMatchSnapshot();
    });
});
