/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import diffSnapshot from "snapshot-diff";

import { cleanup, render, wait, fireEvent } from "foris/testUtils/customTestRender";
import { mockJSONError } from "foris/testUtils/network";
import mockAxios from "jest-mock-axios";

import packagesFixture from "./__fixtures__/packages";
import Packages from "../Packages";

describe("<Packages/>", () => {
    let firstRender;
    let queryByText;
    let getByText;
    let getByLabelText;

    beforeEach(async () => {
        let asFragment;
        ({
            queryByText,
            getByLabelText,
            getByText,
            asFragment
        } = render(<Packages/>));
        await wait(
            () => expect(mockAxios.get)
                .toBeCalledWith("/reforis/api/packages", expect.anything())
        );
        mockAxios.mockResponse({ data: packagesFixture(true) });
        await wait(() => getByText("Enabled package title"));
        firstRender = asFragment();
    });

    it("Should handle error.", async () => {
        const { getByText } = render(<Packages/>);
        mockJSONError();
        await wait(() => {
            expect(getByText("An error occurred while fetching data."))
                .toBeTruthy();
        });
    });

    it("Should render: updates enabled.", () => {
        expect(firstRender)
            .toMatchSnapshot();
    });

    it("Should render: updates disabled.", async () => {
        cleanup();
        const { getByText, asFragment } = render(<Packages/>);
        await wait(
            () => expect(mockAxios.get)
                .toBeCalledWith("/reforis/api/packages", expect.anything())
        );
        mockAxios.mockResponse({ data: packagesFixture(false) });

        await wait(() => getByText("Enabled package title"));

        expect(diffSnapshot(firstRender, asFragment()))
            .toMatchSnapshot();
    });

    it("Should not render hidden package.", () => {
        const HTMLHiddenPackageMessage = queryByText("Hidden package description");
        expect(HTMLHiddenPackageMessage)
            .toBeNull();
    });

    it("Send packages.", () => {
        fireEvent.click(getByText("Save"));
        expect(mockAxios.post)
            .toHaveBeenCalledWith("/reforis/api/packages", {
                "package_lists": [
                    {
                        "name": "enabled-package",
                        "options": [],
                    },
                ],
            }, expect.anything());
    });

    it("Send packages with options.", () => {
        fireEvent.click(getByText("NAS"));
        fireEvent.click(getByText("Samba"));
        fireEvent.click(getByText("DLNA"));

        fireEvent.click(getByText("Save"));
        expect(mockAxios.post)
            .toHaveBeenCalledWith("/reforis/api/packages", {
                "package_lists": [
                    {
                        "name": "enabled-package",
                        "options": []
                    },
                    {
                        "name": "nas",
                        "options": [
                            {
                                "enabled": false,
                                "name": "samba",
                            },
                            {
                                "enabled": true,
                                "name": "dlna",
                            },
                            {
                                "enabled": true,
                                "name": "transmission",
                            },
                            {
                                "enabled": false,
                                "name": "raid",
                            },
                            {
                                "enabled": false,
                                "name": "encrypt",
                            },

                        ],
                    },
                ],
            }, expect.anything());
    });
});
