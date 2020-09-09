/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import { render } from "foris/testUtils/customTestRender";
import GuideHelper from "../GuideHelper";
import { WebSockets } from "foris";

describe("<GuideHelp/>", () => {
    const webSockets = new WebSockets();

    it("displays lan help without completed message", () => {
        const { container } = render(
            <GuideHelper
                ws={webSockets}
                workflow="router"
                step="lan"
                next_step="some"
            />
        );
        expect(container.firstChild).toMatchSnapshot();
    });

    it("displays lan help with completed message", () => {
        const { container } = render(
            <GuideHelper
                ws={webSockets}
                workflow="router"
                step="lan"
                next_step="some"
                completed
            />
        );
        expect(container.firstChild).toMatchSnapshot();
    });

    it("displays lan help without completed message - server workflow", () => {
        const { container } = render(
            <GuideHelper
                ws={webSockets}
                workflow="bridge"
                step="lan"
                next_step="some"
            />
        );
        expect(container.firstChild).toMatchSnapshot();
    });

    it("doesn't display completed message if it doesn't exist", () => {
        const { container } = render(
            <GuideHelper
                ws={webSockets}
                workflow="bridge"
                step="finished"
                next_step="some"
                completed
            />
        );
        expect(container.firstChild).toMatchSnapshot();
    });

    it("doesn't display anything if step doesn't exist", () => {
        const { container } = render(
            <GuideHelper
                ws={webSockets}
                workflow="router"
                step="qwe"
                next_step="some"
                completed
            />
        );
        expect(container.firstChild).toMatchSnapshot();
    });

    it("doesn't display initial message if it doesn't exist", () => {
        const { container } = render(
            <GuideHelper
                ws={webSockets}
                workflow="router"
                step="profile"
                next_step="some"
            />
        );
        expect(container.firstChild).toMatchSnapshot();
    });
});
