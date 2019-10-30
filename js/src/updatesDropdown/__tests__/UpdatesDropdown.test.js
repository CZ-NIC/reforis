/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import { render, waitForElement, waitForElementToBeRemoved, wait, fireEvent } from "customTestRender";
import mockAxios from 'jest-mock-axios';
import { mockJSONError } from "foris";

import UpdatesDropdown from "../UpdatesDropdown";

describe("<UpdatesDropdown/>", () => {
    let container, getByText;
    const exampleHash = "303808909";

    beforeEach(() => {
        ({ container, getByText } = render(<UpdatesDropdown />));
    });

    it("Loading (spinner visible)", async () => {
        expect(container).toMatchSnapshot();
    });

    it("No updates awaiting", async () => {
        mockAxios.mockResponse({data: {approvable: false}});
        await waitForElementToBeRemoved(() => document.querySelector('#updates-dropdown'));
    });

    it("Updates awaiting - snapshot", async () => {
        mockAxios.mockResponse({data: {hash: exampleHash, approvable: true}});
        await waitForElement(() => getByText("Approve update"));
        expect(container).toMatchSnapshot();
    });

    it("Updates awaiting - install now", async () => {
        mockAxios.mockResponse({data: {hash: exampleHash, approvable: true}});
        await waitForElement(() => getByText("Approve update"));

        fireEvent.click(getByText("Install now"));
        expect(mockAxios.post).toBeCalled();
        expect(mockAxios.post).toHaveBeenCalledWith("/api/approvals", {"hash": exampleHash, "solution": "grant"}, expect.anything());

        // Reload approvals when resolution is successful
        await wait(() => expect(mockAxios.get).toBeCalledTimes(1));
        mockAxios.mockResponse({data: {}});
        await wait(() => expect(mockAxios.get).toBeCalledTimes(2));
    });

    it("Updates awaiting - ignore", async () => {
        mockAxios.mockResponse({data: {hash: exampleHash, approvable: true}});
        await waitForElement(() => getByText("Approve update"));

        fireEvent.click(getByText("Ignore"));
        expect(mockAxios.post).toBeCalled();
        expect(mockAxios.post).toHaveBeenCalledWith("/api/approvals", {"hash": exampleHash, "solution": "deny"}, expect.anything());
    });

    it("Updates resolution - display error", async () => {
        mockAxios.mockResponse({data: {hash: exampleHash, approvable: true}});
        await waitForElement(() => getByText("Approve update"));
        fireEvent.click(getByText("Install now"));
        mockJSONError();
        await waitForElement(() => getByText("Cannot resolve update"));
    });
});
