/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import diffSnapshot from "snapshot-diff";

import { cleanup, render, wait } from "foris/testUtils/customTestRender";
import { mockJSONError } from "foris/testUtils/network";
import mockAxios from "jest-mock-axios";

import packagesFixture from "./__fixtures__/packages";
import Packages from "../Packages";

describe("<Packages/>", () => {
    let firstRender;
    let queryByText;

    beforeEach(async () => {
        const renderRes = render(<Packages/>);
        queryByText = renderRes.queryByText;
        await wait(() => expect(mockAxios.get).toBeCalledWith("/reforis/api/packages", expect.anything()));
        mockAxios.mockResponse({data: packagesFixture(true)});
        await wait(() => renderRes.getByText("Enabled package title"));
        firstRender = renderRes.asFragment();
    });

    it("should handle error", async () => {
        const { getByText } = render(<Packages/>);
        mockJSONError();
        await wait(() => {
            expect(getByText("An error occurred while fetching data.")).toBeTruthy();
        });
    });

    it("Updates enabled", () => {
        expect(firstRender).toMatchSnapshot()
    });

    it("Updates disabled", async () => {
        cleanup();
        const {getByText, asFragment} = render(<Packages/>);
        await wait(() => expect(mockAxios.get).toBeCalledWith("/reforis/api/packages", expect.anything()));
        mockAxios.mockResponse({data: packagesFixture(false)});

        await wait(() => getByText("Enabled package title"));

        expect(diffSnapshot(firstRender, asFragment())).toMatchSnapshot();
    });

    it("Test hidden.", () => {
        const HTMLHiddenPackageMessage = queryByText("Hidden package msg");
        expect(HTMLHiddenPackageMessage).toBeNull();
    })
});
