/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import { render, fireEvent, wait } from "customTestRender";

import mockAxios from "jest-mock-axios";
import { mockSetAlert, WebSockets, ALERT_TYPES, mockJSONError } from "foris";

import ResetWiFiSettings from "../ResetWiFiSettings";

describe("<ResetWiFiSettings/>", () => {
    const webSockets = new WebSockets();
    let getAllByText;

    beforeEach(() => {
        ({ getAllByText } = render(<ResetWiFiSettings ws={webSockets} />));
    });

    it("should display alert on open ports - success", async () => {
        fireEvent.click(getAllByText("Reset Wi-Fi Settings")[1]);
        expect(mockAxios.post).toBeCalledWith("/api/wifi-reset", undefined, expect.anything());
        mockAxios.mockResponse({ data: { foo: "bar" } });
        await wait(() => expect(mockSetAlert).toBeCalledWith("Wi-Fi settings are set to defaults", ALERT_TYPES.SUCCESS));
    });

    it("should display alert on open ports - failure", async () => {
        fireEvent.click(getAllByText("Reset Wi-Fi Settings")[1]);
        mockJSONError();
        await wait(() => expect(mockSetAlert).toBeCalledWith("An error occurred during resetting Wi-Fi settings"));
    });
});
