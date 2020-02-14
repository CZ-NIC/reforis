/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import {
    fireEvent, render, waitForElement, act,
} from "foris/testUtils/customTestRender";
import mockAxios from "jest-mock-axios";

import { WebSockets } from "foris";

import ConnectionTest from "../ConnectionTest";
import wsTestResultMessage from "./__fixtures__/testResults";

describe("<ConnectionTest/>", () => {
    const webSockets = new WebSockets();

    it("Snapshot before connection test.", () => {
        const { asFragment } = render(<ConnectionTest ws={webSockets} type="wan" />);
        expect(asFragment()).toMatchSnapshot();
    });

    it("Snapshots with connection test results.", async () => {
        const { asFragment, getByText } = render(<ConnectionTest ws={webSockets} type="wan" />);
        fireEvent.click(getByText("Test connection"));
        const testId = "test-id";
        mockAxios.mockResponse({ data: { test_id: testId } });
        await waitForElement(() => getByText(/Test is running/));

        // Simulate receiving message from WS server
        act(() => webSockets.dispatch(wsTestResultMessage(testId, "wan")));

        expect(asFragment()).toMatchSnapshot();
    });

    it("Run test twice.", async () => {
        const { getByText } = render(<ConnectionTest ws={webSockets} type="wan" />);
        fireEvent.click(getByText("Test connection"));
        const testId = "test-id";
        mockAxios.mockResponse({ data: { test_id: testId } });
        await waitForElement(() => getByText(/Test is running/));

        // Simulate receiving message from WS server
        act(() => webSockets.dispatch(wsTestResultMessage(testId, "wan")));

        fireEvent.click(getByText("Test connection again"));
        act(() => mockAxios.mockResponse({ data: { test_id: testId } }));
        await waitForElement(() => getByText(/Test is running/));
        act(() => webSockets.dispatch(wsTestResultMessage(testId, "wan")));

        await waitForElement(() => getByText("Test connection again"));
    });

    it("Snapshot after trigger WAN connection test.", async () => {
        const { asFragment, getByText } = render(<ConnectionTest ws={webSockets} type="wan" />);
        fireEvent.click(getByText("Test connection"));

        mockAxios.mockResponse({ data: { test_id: "test-id" } });
        await waitForElement(() => getByText("IPv6 connectivity"));

        expect(mockAxios.post).toBeCalled();
        expect(mockAxios.post).toHaveBeenCalledWith("/reforis/api/connection-test", undefined, expect.anything());
        expect(asFragment()).toMatchSnapshot();
    });

    it("Snapshot after trigger DNS connection test.", async () => {
        const { asFragment, getByText } = render(<ConnectionTest ws={webSockets} type="dns" />);
        fireEvent.click(getByText("Test connection"));
        mockAxios.mockResponse({ data: { test_id: "test-id" } });
        await waitForElement(() => getByText(/DNSSEC/));

        expect(mockAxios.post).toBeCalled();
        expect(mockAxios.post).toHaveBeenCalledWith("/reforis/api/dns/test", undefined, expect.anything());
        expect(asFragment()).toMatchSnapshot();
    });
});
