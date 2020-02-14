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
import { notificationsFixture } from "./__fixtures__/notifications";

import NotificationsCenter from "../Notifications/NotificationsCenter";

describe("<NotificationsCenter/>", () => {
    it("Test with snapshot.", async () => {
        const webSockets = new WebSockets();
        const { container, getByText } = render(<NotificationsCenter ws={webSockets} />);
        mockAxios.mockResponse({ data: notificationsFixture });
        await wait(() => {
            getByText("Notification message.");
        });
        expect(container.firstChild).toMatchSnapshot();
    });

    it("Test with spinner.", () => {
        const webSockets = new WebSockets();
        const { container } = render(<NotificationsCenter ws={webSockets} />);
        expect(container).toMatchSnapshot();
    });
});
