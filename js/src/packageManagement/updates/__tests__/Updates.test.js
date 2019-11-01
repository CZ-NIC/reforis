/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import { render, wait, fireEvent } from "foris/testUtils/customTestRender";
import mockAxios from 'jest-mock-axios';
import { mockJSONError } from "foris/testUtils/network";

import { exampleUpdate } from "./__fixtures__/updates";
import Updates from "../Updates";

describe("<Updates/>", () => {
    let container;
    let getByText;

    beforeEach(() => {
        ({ container, getByText } = render(<Updates />));
    });

    it("should display spinner", () => {
        expect(container).toMatchSnapshot();
    });

    it("should handle error", async () => {
        expect(mockAxios.get).toBeCalledWith("/api/updates", expect.anything());
        mockJSONError();
        await wait(() => expect(container).toMatchSnapshot());
    });

    it("should handle disabled updates", async () => {
        mockAxios.mockResponse({ data: { enabled: false, approval_settings: {} } });
        await wait(() => expect(container).toMatchSnapshot());
    });

    it("should handle automatic updates (no delays/approvals)", async () => {
        mockAxios.mockResponse({ data: { enabled: true, approval_settings: { status: "off" } } });
        await wait(() => expect(container).toMatchSnapshot());
    });

    it("should handle approvable updates", async () => {
        mockAxios.mockResponse({ data: { enabled: true, approval_settings: { status: "delayed" } } });
        await wait(() => expect(getByText("Manually check for updates and review them immediately.")).toBeTruthy());
        // List of approvals
        expect(mockAxios.get).nthCalledWith(2, "/api/approvals", expect.anything());
        mockAxios.mockResponse({ data: exampleUpdate });
        await wait(() => expect(container).toMatchSnapshot());
    });

    it("should display spinner while check is pending", async () => {
        mockAxios.mockResponse({ data: { enabled: true, approval_settings: { status: "off" } } });
        await wait(() => getByText("Manually check for updates and install them immediately."));

        // Run updater
        fireEvent.click(getByText("Check and install updates"));
        await wait(() => expect(mockAxios.post).toBeCalledWith("/api/updates/run", undefined, expect.anything()));
        // Spinner appears
        expect(container).toMatchSnapshot();

        // Proceed to status check
        mockAxios.mockResponse({data: { running: true }});
        await wait(() => expect(mockAxios.get).nthCalledWith(2, "/api/updates/status", expect.anything()));
        // Spinner is still visible
        expect(container).toMatchSnapshot();
    });
});
