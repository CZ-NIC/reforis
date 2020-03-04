/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect } from "react";

import { useAPIGet } from "foris";
import { render } from "foris/testUtils/customTestRender";

import ErrorBoundary from  "../ErrorBoundary";

function mockBrokenGET() {
    throw new Error("This API request is broken!");
}

jest.mock("foris/api/utils", () => ({
    ...jest.requireActual('foris/api/utils'),
    API_METHODS: {
        GET: mockBrokenGET,
    },
}));

describe("<ErrorBoundary />", () => {
    it("should render children components when there's no error", () => {
        const { container } = render(
            <ErrorBoundary>
                <p>This is the content of the component.</p>
            </ErrorBoundary>
        );
        expect(container).toMatchSnapshot();
    });

    it("should display error message", () => {
        const BrokenComponent = () => {
            throw new Error("This component is broken!");
        };

        const content = document.createElement("div");
        content.setAttribute("id", "content-container");

        const originalError = console.error;
        console.error = jest.fn();
        const { container } = render(
            <>
                <ErrorBoundary>
                    <BrokenComponent />
                </ErrorBoundary>
            </>,
            { container: document.body.appendChild(content) }
        );
        expect(console.error).toBeCalled();
        console.error = originalError;

        expect(container).toMatchSnapshot();
    });

    it("should handle unexpected API error", () => {
        const BrokenAPIComponent = () => {
            const [, getExample] = useAPIGet("");
            useEffect(() => {
                getExample();
            }, [getExample]);
            return <p>No errors so far!</p>;
        };

        const content = document.createElement("div");
        content.setAttribute("id", "content-container");

        const originalError = console.error;
        console.error = jest.fn();
        const { container } = render(
            <>
                <ErrorBoundary>
                    <BrokenAPIComponent />
                </ErrorBoundary>
            </>,
            { container: document.body.appendChild(content) }
        );
        expect(console.error).toBeCalled();
        console.error = originalError;

        expect(container).toMatchSnapshot();
    });
});
