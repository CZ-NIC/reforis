/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import {
    fireEvent,
    getByLabelText,
    getAllByLabelText,
    getByText,
    getAllByText,
    render,
    wait,
} from "foris/testUtils/customTestRender";
import mockAxios from "jest-mock-axios";
import { ALERT_TYPES } from "foris";
import { mockJSONError } from "foris/testUtils/network";
import { mockSetAlert } from "foris/testUtils/alertContextMock";

import Password from "../Password";

describe("<Password/>", () => {
    let passwordContainer;

    beforeEach(async () => {
        const { container } = render(<Password />);
        mockAxios.mockResponse({ data: { password_set: true } });
        mockAxios.mockResponse({ data: {} });
        await wait(() =>
            getByText(container, "Advanced Administration Password")
        );

        passwordContainer = container;
    });

    it("should handle error", async () => {
        const { container } = render(<Password />);
        mockJSONError();
        mockJSONError();
        await wait(() =>
            getByText(container, "An error occurred while fetching data.")
        );
    });

    it("Snapshot", () => {
        expect(passwordContainer).toMatchSnapshot();
    });

    it("Snapshot: same password for root", () => {
        fireEvent.click(
            getByText(
                passwordContainer,
                "Use the same password for advanced administration (root)"
            )
        );
        expect(passwordContainer).toMatchSnapshot();
    });

    it("Snapshot: wrong password confirmation", () => {
        fireEvent.focus(
            getAllByLabelText(passwordContainer, "New password")[0]
        );
        fireEvent.change(
            getAllByLabelText(passwordContainer, "New password")[0],
            {
                target: { value: "testing" },
            }
        );
        fireEvent.focus(
            getAllByLabelText(passwordContainer, "Confirm new password")[0]
        );
        fireEvent.change(
            getAllByLabelText(passwordContainer, "Confirm new password")[0],
            { target: { value: "testingg" } }
        );
        expect(passwordContainer).toMatchSnapshot();
    });

    it("Snapshot: wrong root password confirmation", () => {
        fireEvent.focus(
            getAllByLabelText(passwordContainer, "New password")[1]
        );
        fireEvent.change(
            getAllByLabelText(passwordContainer, "New password")[1],
            {
                target: { value: "testing" },
            }
        );
        fireEvent.focus(
            getAllByLabelText(passwordContainer, "Confirm new password")[1]
        );
        fireEvent.change(
            getAllByLabelText(passwordContainer, "Confirm new password")[1],
            { target: { value: "testingg" } }
        );
        expect(passwordContainer).toMatchSnapshot();
    });

    describe("should notify user", () => {
        beforeEach(() => {
            // Fill form data
            fireEvent.change(
                getByLabelText(passwordContainer, "Current password"),
                { target: { value: "foobar" } }
            );
            fireEvent.change(
                getAllByLabelText(passwordContainer, "New password")[0],
                { target: { value: "foobar" } }
            );
            fireEvent.change(
                getAllByLabelText(passwordContainer, "Confirm new password")[0],
                { target: { value: "foobar" } }
            );

            // Save form
            fireEvent.click(getAllByText(passwordContainer, "Save")[0]);
            expect(mockAxios.post).toBeCalledWith(
                "/reforis/api/password",
                { foris_current_password: "foobar", foris_password: "foobar" },
                expect.anything()
            );
        });

        it("on success", async () => {
            mockAxios.mockResponse({ data: { foo: "bar" } });
            await wait(() =>
                expect(mockSetAlert).toBeCalledWith(
                    "Password changed successfully.",
                    ALERT_TYPES.SUCCESS
                )
            );
        });

        it("on error", async () => {
            const errorMessage = "Something went wrong";
            mockJSONError(errorMessage);
            await wait(() => expect(mockSetAlert).toBeCalledWith(errorMessage));
        });
    });
});

describe("Customized <Password/>", () => {
    let passwordContainer;

    beforeEach(async () => {
        const { container } = render(<Password />);
        mockAxios.mockResponse({ data: { password_set: true } });
        mockAxios.mockResponse({
            data: { customization: "shield" },
        });

        await wait(() => getByText(container, "Password Settings"));

        passwordContainer = container;
    });

    it("should handle error", async () => {
        const { container } = render(<Password />);
        mockJSONError();
        mockJSONError();
        await wait(() =>
            getByText(container, "An error occurred while fetching data.")
        );
    });

    it("Snapshot", () => {
        expect(passwordContainer).toMatchSnapshot();
    });

    describe("should notify user", () => {
        beforeEach(() => {
            // Fill form data
            fireEvent.change(
                getByLabelText(passwordContainer, "Current password"),
                { target: { value: "foobar" } }
            );
            fireEvent.change(
                getByLabelText(passwordContainer, "New password"),
                { target: { value: "foobar" } }
            );
            fireEvent.change(
                getByLabelText(passwordContainer, "Confirm new password"),
                { target: { value: "foobar" } }
            );

            // Save form
            fireEvent.click(getAllByText(passwordContainer, "Save")[0]);
            expect(mockAxios.post).toBeCalledWith(
                "/reforis/api/password",
                {
                    foris_current_password: "foobar",
                    foris_password: "foobar",
                    root_password: "foobar",
                },
                expect.anything()
            );
        });

        it("on success", async () => {
            mockAxios.mockResponse({ data: { foo: "bar" } });
            await wait(() =>
                expect(mockSetAlert).toBeCalledWith(
                    "Password changed successfully.",
                    ALERT_TYPES.SUCCESS
                )
            );
        });

        it("on error", async () => {
            const errorMessage = "Something went wrong";
            mockJSONError(errorMessage);
            await wait(() => expect(mockSetAlert).toBeCalledWith(errorMessage));
        });
    });
});
