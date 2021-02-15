/*
 * Copyright (C) 2021 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import {
    render,
    wait,
    getByText,
    fireEvent,
    getByLabelText,
} from "foris/testUtils/customTestRender";
import { WebSockets } from "foris";
import { mockJSONError } from "foris/testUtils/network";
import mockAxios from "jest-mock-axios";
import Hostname from "../Hostname";

describe("Hostname", () => {
    let hostnameContainer;

    beforeEach(async () => {
        const webSockets = new WebSockets();
        const { container } = render(<Hostname ws={webSockets} />);
        mockAxios.mockResponse({ data: { hostname: "turris" } });
        await wait(() => getByText(container, "Device hostname"));
        hostnameContainer = container;
    });

    it("Should handle error", async () => {
        const webSockets = new WebSockets();
        const { container } = render(<Hostname ws={webSockets} />);
        mockJSONError();
        await wait(() => {
            expect(
                getByText(container, "An error occurred while fetching data.")
            ).toBeTruthy();
        });
    });

    it("Snapshot", async () => {
        expect(hostnameContainer).toMatchSnapshot();
    });

    it("Successful Save request", async () => {
        fireEvent.click(getByText(hostnameContainer, "Save"));
        expect(mockAxios.post).toHaveBeenCalledWith(
            "/reforis/api/system/hostname",
            { hostname: "turris" },
            expect.anything()
        );
    });

    it("TextInput validation", async () => {
        const textInput = getByLabelText(hostnameContainer, "Device hostname");

        const changeHostname = (value) =>
            fireEvent.change(textInput, { target: { value } });

        changeHostname("");
        await wait(() => {
            expect(
                getByText(
                    hostnameContainer,
                    "The hostname can contain only alphanumeric characters, hyphens, underscores and can't be empty."
                )
            ).toBeDefined();
        });
    });
});
