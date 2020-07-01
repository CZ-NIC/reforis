/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import {
    getByText,
    getAllByText,
    fireEvent,
    render,
    wait,
} from "foris/testUtils/customTestRender";

import { WebSockets } from "foris";
import { mockJSONError } from "foris/testUtils/network";
import mockAxios from "jest-mock-axios";
import WiFi from "../WiFi";
import {
    wifiFixture1,
    wifiFixture2,
    wifiFixture3,
} from "./__fixtures__/wifi.js";

describe("<WiFi/>", () => {
    let wifiContainer;

    describe("Enabled only 1 Wi-Fi module:", () => {
        beforeEach(async () => {
            const webSockets = new WebSockets();
            const { container } = render(
                <WiFi ws={webSockets} setFormValue={jest.fn()} />
            );
            mockAxios.mockResponse({ data: wifiFixture1 });

            await wait(() => getByText(container, "Wi-Fi"));
            wifiContainer = container;
        });

        it("Should handle error.", async () => {
            const webSockets = new WebSockets();
            const { getByText } = render(
                <WiFi ws={webSockets} setFormValue={() => {}} />
            );
            mockJSONError();
            await wait(() => {
                expect(
                    getByText("An error occurred while fetching data.")
                ).toBeTruthy();
            });
        });

        it("Form with disabled Wi-Fi module.", async () => {
            expect(wifiContainer).toMatchSnapshot();
        });

        it("Form with enabled Wi-Fi module.", async () => {
            fireEvent.click(getByText(wifiContainer, "Enable"));
            expect(wifiContainer).toMatchSnapshot();
        });

        it("Form with enabled Wi-Fi module and enabled Guest Networks.", async () => {
            fireEvent.click(getByText(wifiContainer, "Enable"));
            fireEvent.click(getByText(wifiContainer, "Enable Guest Wifi"));
            expect(wifiContainer).toMatchSnapshot();
        });
    });

    describe("Enabled 2 Wi-Fi modules:", () => {
        beforeEach(async () => {
            const webSockets = new WebSockets();
            const { container } = render(
                <WiFi ws={webSockets} setFormValue={jest.fn()} />
            );
            mockAxios.mockResponse({ data: wifiFixture2 });

            await wait(() => getByText(container, "Wi-Fi"));
            wifiContainer = container;
        });

        it("Should handle error.", async () => {
            const webSockets = new WebSockets();
            const { getByText } = render(
                <WiFi ws={webSockets} setFormValue={() => {}} />
            );
            mockJSONError();
            await wait(() => {
                expect(
                    getByText("An error occurred while fetching data.")
                ).toBeTruthy();
            });
        });

        it("Form with disabled Wi-Fi modules.", () => {
            expect(wifiContainer).toMatchSnapshot();
        });

        it("Form with enabled Wi-Fi modules.", () => {
            const label = getAllByText(wifiContainer, "Enable");
            fireEvent.click(label[0]);
            fireEvent.click(label[1]);
            expect(wifiContainer).toMatchSnapshot();
        });

        it("Form with enabled Wi-Fi modules and enabled Guest Networks.", () => {
            const label = getAllByText(wifiContainer, "Enable");
            fireEvent.click(label[0]);
            fireEvent.click(label[1]);
            const labelGuest = getAllByText(wifiContainer, "Enable Guest Wifi");
            fireEvent.click(labelGuest[0]);
            fireEvent.click(labelGuest[1]);
            expect(wifiContainer).toMatchSnapshot();
        });
    });

    describe("Enabled 3 Wi-Fi modules:", () => {
        beforeEach(async () => {
            const webSockets = new WebSockets();
            const { container } = render(
                <WiFi ws={webSockets} setFormValue={jest.fn()} />
            );
            mockAxios.mockResponse({ data: wifiFixture3 });

            await wait(() => getByText(container, "Wi-Fi"));
            wifiContainer = container;
        });

        it("Should handle error.", async () => {
            const webSockets = new WebSockets();
            const { getByText } = render(
                <WiFi ws={webSockets} setFormValue={() => {}} />
            );
            mockJSONError();
            await wait(() => {
                expect(
                    getByText("An error occurred while fetching data.")
                ).toBeTruthy();
            });
        });

        it("Form with disabled Wi-Fi modules.", () => {
            expect(wifiContainer).toMatchSnapshot();
        });

        it("Form with enabled Wi-Fi modules.", () => {
            const label = getAllByText(wifiContainer, "Enable");
            fireEvent.click(label[0]);
            fireEvent.click(label[1]);
            fireEvent.click(label[2]);
            expect(wifiContainer).toMatchSnapshot();
        });

        it("Form with enabled Wi-Fi modules and enabled Guest Networks.", () => {
            const label = getAllByText(wifiContainer, "Enable");
            fireEvent.click(label[0]);
            fireEvent.click(label[1]);
            fireEvent.click(label[2]);
            const labelGuest = getAllByText(wifiContainer, "Enable Guest Wifi");
            fireEvent.click(labelGuest[0]);
            fireEvent.click(labelGuest[1]);
            fireEvent.click(labelGuest[2]);
            expect(wifiContainer).toMatchSnapshot();
        });
    });
});
