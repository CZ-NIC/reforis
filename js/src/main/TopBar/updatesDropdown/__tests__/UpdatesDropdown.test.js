/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import {
    render,
    waitForElement,
    wait,
    fireEvent,
} from "foris/testUtils/customTestRender";
import mockAxios from "jest-mock-axios";
import { mockJSONError } from "foris/testUtils/network";
import { newNotification } from "../../../../notifications/__tests__/__fixtures__/notifications";
import UpdatesDropdown from "../UpdatesDropdown";

describe("<UpdatesDropdown/>", () => {
    let container;
    let getByText;
    let getByTestId;
    let queryByTestId;
    const exampleHash = "303808909";

    beforeEach(() => {
        ({ container, getByText, getByTestId, queryByTestId } = render(
            <UpdatesDropdown newNotification={newNotification} />
        ));
    });

    it("Loading (spinner visible)", async () => {
        expect(container).toMatchSnapshot();
    });

    it("No updates awaiting", async () => {
        expect(getByTestId("updates-dropdown")).toBeTruthy();
        mockAxios.mockResponse({ data: { approvable: false } });
        await wait(() => expect(queryByTestId("updates-dropdown")).toBeFalsy());
    });

    it("Updates awaiting - snapshot", async () => {
        mockAxios.mockResponse({
            data: { hash: exampleHash, approvable: true },
        });
        await waitForElement(() => getByText("Approve Update"));
        expect(container).toMatchSnapshot();
    });

    it("Updates awaiting - install now", async () => {
        mockAxios.mockResponse({
            data: { hash: exampleHash, approvable: true },
        });
        await waitForElement(() => getByText("Approve Update"));

        fireEvent.click(getByText("Install now"));
        expect(mockAxios.post).toBeCalled();
        expect(mockAxios.post).toHaveBeenCalledWith(
            "/reforis/api/approvals",
            { hash: exampleHash, solution: "grant" },
            expect.anything()
        );

        // Reload approvals when resolution is successful
        await wait(() => expect(mockAxios.get).toBeCalledTimes(1));
        mockAxios.mockResponse({ data: {} });
        await wait(() => expect(mockAxios.get).toBeCalledTimes(2));
    });

    it("Updates resolution - display error", async () => {
        mockAxios.mockResponse({
            data: { hash: exampleHash, approvable: true },
        });
        await waitForElement(() => getByText("Approve Update"));
        fireEvent.click(getByText("Install now"));
        mockJSONError();
        await waitForElement(() => getByText("Cannot install updates."));
    });
});
