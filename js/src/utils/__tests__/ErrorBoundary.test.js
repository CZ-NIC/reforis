/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { render } from "foris/testUtils/customTestRender";

import ErrorBoundary from  "../ErrorBoundary";

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
            qwe = asd;
            return null;
        };
        const content = document.createElement("div");
        content.setAttribute("id", "content-container");
        const { container } = render(
            <>
                <ErrorBoundary>
                    <BrokenComponent />
                </ErrorBoundary>
            </>,
            { container: document.body.appendChild(content) }
        );
        expect(container).toMatchSnapshot();
    });
});
