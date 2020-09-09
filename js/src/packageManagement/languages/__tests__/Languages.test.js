/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import diffSnapshot from "snapshot-diff";

import {
    cleanup,
    render,
    wait,
    fireEvent,
} from "foris/testUtils/customTestRender";
import { mockJSONError } from "foris/testUtils/network";
import mockAxios from "jest-mock-axios";

import languagesFixture from "./__fixtures__/languages";
import Languages from "../Languages";

describe("<Packages/>", () => {
    let firstRender;
    let queryByText;
    let getByText;
    let getByLabelText;

    beforeEach(async () => {
        let asFragment;
        ({ queryByText, getByLabelText, getByText, asFragment } = render(
            <Languages />
        ));
        await wait(() =>
            expect(mockAxios.get).toBeCalledWith(
                "/reforis/api/language-packages",
                expect.anything()
            )
        );
        mockAxios.mockResponse({ data: languagesFixture(true) });
        await wait(() => getByText("CS"));
        firstRender = asFragment();
    });

    it("Should handle error.", async () => {
        const { getByText } = render(<Languages />);
        mockJSONError();
        await wait(() => {
            expect(
                getByText("An error occurred while fetching data.")
            ).toBeTruthy();
        });
    });

    it("Should render: updates enabled.", () => {
        expect(firstRender).toMatchSnapshot();
    });

    it("Should render: updates disabled.", async () => {
        cleanup();
        const { getByText, asFragment } = render(<Languages />);
        await wait(() =>
            expect(mockAxios.get).toBeCalledWith(
                "/reforis/api/language-packages",
                expect.anything()
            )
        );
        mockAxios.mockResponse({ data: languagesFixture(false) });

        await wait(() => getByText("CS"));

        expect(diffSnapshot(firstRender, asFragment())).toMatchSnapshot();
    });

    it("Send languages.", () => {
        fireEvent.click(getByText("Save"));
        expect(mockAxios.post).toHaveBeenCalledWith(
            "/reforis/api/language-packages",
            {
                languages: ["cs"],
            },
            expect.anything()
        );
    });
});
