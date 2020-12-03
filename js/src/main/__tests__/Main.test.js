/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { render, wait, getByText } from "foris/testUtils/customTestRender";
import { WebSockets } from "foris";
import mockAxios from "jest-mock-axios";

import Main from "../Main";

function mockBrokenComponent() {
    throw new Error("This component is broken!");
}

jest.mock("../pages", () => {
    return () => [
        {
            name: "Overview",
            path: "/overview",
            icon: "chart-line",
            component: mockBrokenComponent,
        },
    ];
});

describe("<Main/>", () => {
    it("should use error boundary when cannot render component", async () => {
        global.ForisPlugins = [];
        const webSockets = new WebSockets();
        const originalError = console.error;

        console.error = jest.fn();
        const { container } = render(
            <>
                <div id="content-container" />
                <Main ws={webSockets} />
            </>
        );
        mockAxios.mockResponse({ data: {} });
        await wait(() => getByText(container, "An Error Occurred"));
        expect(console.error).toBeCalled();
        console.error = originalError;

        expect(container).toMatchSnapshot();
    });
});
