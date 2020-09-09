/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import mockAxios from "jest-mock-axios";
import { render, wait } from "foris/testUtils/customTestRender";
import { mockJSONError } from "foris/testUtils/network";

import About from "../About";

describe("About", () => {
    it("should handle errors", async () => {
        const { getByText } = render(<About />);
        expect(mockAxios.get).toBeCalledWith(
            "/reforis/api/about",
            expect.anything()
        );
        mockJSONError();
        await wait(() => getByText("An error occurred while fetching data."));
    });
});
