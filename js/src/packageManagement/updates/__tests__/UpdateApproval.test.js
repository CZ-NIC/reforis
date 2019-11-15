/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import { render, fireEvent, getByText, wait } from "foris/testUtils/customTestRender";
import mockAxios from 'jest-mock-axios';

import { mockJSONError } from "foris/testUtils/network";
import { mockSetAlert } from "foris/testUtils/alertContextMock";

import { exampleHash, exampleUpdate } from "./__fixtures__/updates";
import UpdateApproval from "../UpdateApproval";

describe("<UpdateApproval/>", () => {
    const onSuccess = jest.fn();

    function renderUpdateApproval(update=exampleUpdate) {
        const { container } = render(
            <UpdateApproval update={update} onSuccess={onSuccess} />
        );
        return container;
    }

    it("No updates awaiting", () => {
        const container = renderUpdateApproval({ ...exampleUpdate, approvable: false });
        expect(getByText(container, "There are no updates awaiting your approval.")).toBeTruthy();
        expect(container).toMatchSnapshot();
    });

    it("Updates awaiting - snapshot", () => {
        const container = renderUpdateApproval();
        expect(container).toMatchSnapshot();
    });

    it("Updates resolution - install now", async () => {
        const container = renderUpdateApproval();
        fireEvent.click(getByText(container, "Install now"));
        expect(mockAxios.post).toHaveBeenCalledWith("/api/approvals", {"hash": exampleHash, "solution": "grant"}, expect.anything());

        // Reload approvals when resolution is successful
        expect(onSuccess).not.toBeCalled();
        mockAxios.mockResponse({data: {}});
        await wait(() => expect(onSuccess).toBeCalled());
    });

    it("Updates resolution - ignore", () => {
        const container = renderUpdateApproval();
        fireEvent.click(getByText(container, "Ignore"));
        expect(mockAxios.post).toHaveBeenCalledWith("/api/approvals", {"hash": exampleHash, "solution": "deny"}, expect.anything());
    });

    it("Updates resolution - spinner", async () => {
        const container = renderUpdateApproval();
        fireEvent.click(getByText(container, "Install now"));
        expect(container).toMatchSnapshot();
    });

    it("Updates resolution - display error", async () => {
        const container = renderUpdateApproval();
        fireEvent.click(getByText(container, "Ignore"));
        mockJSONError();
        await wait(() => expect(mockSetAlert).toBeCalledWith("Cannot resolve update"));
    });
});
