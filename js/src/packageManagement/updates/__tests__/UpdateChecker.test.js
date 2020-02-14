/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useState } from "react";
import {
    render, fireEvent, wait, act,
} from "foris/testUtils/customTestRender";
import mockAxios from "jest-mock-axios";

import { mockJSONError } from "foris/testUtils/network";
import { mockSetAlert } from "foris/testUtils/alertContextMock";

import UpdateChecker from "../UpdateChecker";

describe("<UpdateChecker/>", () => {
    let container;
    let rerender;
    let getByText;
    const setPending = jest.fn();
    const onSuccess = () => new Promise((resolve) => resolve());

    function rerenderWithPending(pending) {
        rerender(
            <UpdateChecker
                onSuccess={onSuccess}
                pending={pending}
                setPending={setPending}
            >
                {"Check updates"}
            </UpdateChecker>,
        );
    }

    beforeEach(() => {
        ({ container, getByText, rerender } = render(
            <UpdateChecker
                onSuccess={onSuccess}
                pending={false}
                setPending={setPending}
            >
                {"Check updates"}
            </UpdateChecker>,
        ));
    });

    it("should match snapshot", () => {
        expect(container).toMatchSnapshot();
    });

    it("should handle success on updater start", async () => {
        fireEvent.click(getByText("Check updates"));
        expect(setPending).toBeCalledWith(true);
        rerenderWithPending(true);
        expect(mockAxios.post).toBeCalledWith("/reforis/api/updates/run", undefined, expect.anything());
        mockAxios.mockResponse({ data: { result: true } });

        // Repeated check for status
        await wait(() => expect(mockAxios.get).nthCalledWith(2, "/reforis/api/updates/status", expect.anything()));
        mockAxios.mockResponse({ data: { running: false } });

        await wait(() => expect(setPending).toBeCalledWith(false));
    });

    it("should handle error on updater start", async () => {
        fireEvent.click(getByText("Check updates"));
        const errorMessage = "API error";
        // Response to POST updates/run
        mockJSONError(errorMessage);
        await wait(() => expect(setPending).toBeCalledWith(false));
        expect(mockSetAlert).toBeCalledWith(errorMessage);
    });

    it("should handle success on updater check", async () => {
        fireEvent.click(getByText("Check updates"));
        rerenderWithPending(true);
        // Response to POST updates/run
        await wait(() => expect(mockAxios.post).toBeCalledWith("/reforis/api/updates/run", undefined, expect.anything()));
        mockAxios.mockResponse({ data: { result: true } });

        await wait(() => expect(mockAxios.get).toBeCalledWith("/reforis/api/updates/status", expect.anything()));
        mockAxios.mockResponse({ data: { running: true } });

        // Repeated check for status
        await wait(() => expect(mockAxios.get).nthCalledWith(2, "/reforis/api/updates/status", expect.anything()));
        mockAxios.mockResponse({ data: { running: false } });

        await wait(() => expect(setPending).toBeCalledWith(false));
    });

    it("should handle error on updater check", async () => {
        fireEvent.click(getByText("Check updates"));
        rerenderWithPending(true);
        await wait(() => expect(mockAxios.post).toBeCalledWith("/reforis/api/updates/run", undefined, expect.anything()));

        // Response to POST updates/run
        mockAxios.mockResponse({ data: { result: true } });

        await wait(() => expect(mockAxios.get).toBeCalledWith("/reforis/api/updates/status", expect.anything()));
        mockJSONError();

        await wait(() => expect(mockSetAlert).toBeCalledWith("Cannot fetch updater status."));
    });
});
