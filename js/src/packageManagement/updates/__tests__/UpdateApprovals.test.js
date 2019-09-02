/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import { render, waitForElement, fireEvent } from "customTestRender";
import mockAxios from 'jest-mock-axios';

import UpdateApprovals from "../UpdateApprovals";

describe("<UpdateApprovals/>", () => {
    let container, getByText;
    const examplePlan = {name: "", op: ""},
        exampleHash = "303808909";

    beforeEach(() => {
        ({ container, getByText } = render(<UpdateApprovals />));
    });

    it("Loading (spinner visible)", async () => {
        expect(container).toMatchSnapshot();
    });

    it("No updates awaiting - delayed updates", async () => {
        mockAxios.mockResponse({data: {present: true, status: "delayed", update_automatically: true}});
        await waitForElement(() => getByText("There are no updates awaiting your approval."));
        expect(container).toMatchSnapshot();
    });

    it("No updates awaiting - automatic updates turned off", async () => {
        mockAxios.mockResponse({data: {present: true, status: "asked", update_automatically: false}});
        await waitForElement(() => getByText("There are no updates awaiting your approval."));
        expect(container).toMatchSnapshot();
    });

    it("No updates awaiting - empty list of packages", async () => {
        mockAxios.mockResponse({data: {present: true, status: "asked", update_automatically: true, plan: []}});
        await waitForElement(() => getByText("There are no updates awaiting your approval."));
        expect(container).toMatchSnapshot();
    });

    it("Updates awaiting - snapshot", async () => {
        mockAxios.mockResponse({data: {present: true, status: "asked", update_automatically: true, plan: [examplePlan]}});
        await waitForElement(() => getByText("Approve update from %s"));
        expect(container).toMatchSnapshot();
    });

    it("Updates awaiting - install now", async () => {
        mockAxios.mockResponse({data: {present: true, status: "asked", update_automatically: true, plan: [examplePlan], hash: exampleHash}});
        await waitForElement(() => getByText("Approve update from %s"));

        fireEvent.click(getByText("Install now"));
        expect(mockAxios.post).toBeCalled();
        expect(mockAxios.post).toHaveBeenCalledWith("/api/approvals", {"hash": exampleHash, "solution": "grant"}, expect.anything());
    });

    it("Updates awaiting - deny", async () => {
        mockAxios.mockResponse({data: {present: true, status: "asked", update_automatically: true, plan: [examplePlan], hash: exampleHash}});
        await waitForElement(() => getByText("Approve update from %s"));

        fireEvent.click(getByText("Deny"));
        expect(mockAxios.post).toBeCalled();
        expect(mockAxios.post).toHaveBeenCalledWith("/api/approvals", {"hash": exampleHash, "solution": "deny"}, expect.anything());
    });
});
