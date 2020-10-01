/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import { render, wait } from "foris/testUtils/customTestRender";

import {
    notificationsFixture,
    newNotification,
    isLoading,
    dismissAll,
    dismiss,
} from "./__fixtures__/notifications";

import NotificationsDropdown from "../../main/TopBar/NotificationsDropdown/NotificationsDropdown";

describe("<NotificationsDropdown/>", () => {
    let notificationCenterContainer;

    beforeEach(async () => {
        const { container, getByText } = render(
            <NotificationsDropdown
                notifications={notificationsFixture.notifications}
                newNotification={newNotification}
                isLoading={isLoading}
                dismiss={dismiss}
                dismissAll={dismissAll}
            />
        );
        notificationCenterContainer = container;
        await wait(() => {
            getByText("Notification message.");
        });
    });

    it("Test with snapshot", () => {
        expect(notificationCenterContainer).toMatchSnapshot();
    });
});
