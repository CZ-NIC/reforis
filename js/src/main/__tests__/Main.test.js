/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { render } from "foris/testUtils/customTestRender";
import { WebSockets } from "foris";

import Main from "../Main";

function mockBrokenComponent() {
    // Trigger error
    qwe = asd;
    return <p>Notifications!</p>
}

jest.mock("../pages", () => {
    return () => [
        {
            name: "Notifications",
            path: "/notifications",
            icon: "bell",
            component: mockBrokenComponent,
        },
    ];
});

describe("<Main/>", () => {
    it("should use error boundary when cannot render component", () => {
        global.ForisPlugins = [];
        const webSockets = new WebSockets();
        const { container } = render(
            <>
                <div id="content-container" />
                <Main ws={webSockets} />
            </>,
        );
        expect(container).toMatchSnapshot();
    });
});
