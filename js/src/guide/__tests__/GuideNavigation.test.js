/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import { getByText, render, wait } from "foris/testUtils/customTestRender";

import GuideNavigation from "../GuideNavigation/GuideNavigation";
import { guideFixtures } from "./__fixtures__/guide";

describe("<GuideNavigation/>", () => {
    let guideNavigationContainer;

    beforeEach(async () => {
        const { container } = render(<GuideNavigation {...guideFixtures} />);
        await wait(() => getByText(container, /Password/));
        guideNavigationContainer = container;
    });

    it("Snapshot.", () => {
        expect(guideNavigationContainer).toMatchSnapshot();
    });
});
