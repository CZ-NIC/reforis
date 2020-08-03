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
    getByText,
    render,
    wait,
} from "foris/testUtils/customTestRender";

import { WebSockets } from "foris";
import { mockJSONError } from "foris/testUtils/network";
import mockAxios from "jest-mock-axios";
import lanSettingsFixture from "./__fixtures__/lanSettings";

import LAN from "../LAN";

describe("<LAN/>", () => {
    let lanContainer;

    beforeEach(async () => {
        const webSockets = new WebSockets();
        const { container } = render(<LAN ws={webSockets} />);
        mockAxios.mockResponse({ data: lanSettingsFixture });
        await wait(() => getByText(container, "Save"));
        lanContainer = container;
    });

    it("should handle error", async () => {
        const webSockets = new WebSockets();
        const { container } = render(<LAN ws={webSockets} />);
        mockJSONError();
        await wait(() => {
            expect(
                getByText(container, "An error occurred while fetching data.")
            ).toBeTruthy();
        });
    });

    it("Snapshot unmanaged (dhcp).", () => {
        expect(lanContainer).toMatchSnapshot();
    });

    it("Snapshot unmanaged static.", () => {
        fireEvent.change(getByLabelText(lanContainer, "IPv4 protocol"), {
            target: { value: "static" },
        });
        expect(lanContainer).toMatchSnapshot();
    });

    it("Snapshot unmanaged none.", () => {
        fireEvent.change(getByLabelText(lanContainer, "IPv4 protocol"), {
            target: { value: "none" },
        });
        expect(lanContainer).toMatchSnapshot();
    });

    it("Snapshot managed.", () => {
        fireEvent.change(getByLabelText(lanContainer, "LAN mode"), {
            target: { value: "managed" },
        });
        expect(lanContainer).toMatchSnapshot();
    });

    it("Snapshot managed with enabled DHCP.", () => {
        fireEvent.change(getByLabelText(lanContainer, "LAN mode"), {
            target: { value: "managed" },
        });
        fireEvent.click(getByText(lanContainer, "Enable DHCP"));
        expect(lanContainer).toMatchSnapshot();
    });

    it("Test post unmanaged dhcp.", async () => {
        fireEvent.click(getByText(lanContainer, "Save"));
        expect(mockAxios.post).toBeCalled();
        const data = {
            mode: "unmanaged",
            mode_unmanaged: { lan_dhcp: {}, lan_type: "dhcp" },
        };
        expect(mockAxios.post).toHaveBeenCalledWith(
            "/reforis/api/lan",
            data,
            expect.anything()
        );
    });

    it("Test post unmanaged static.", async () => {
        fireEvent.change(getByLabelText(lanContainer, "IPv4 protocol"), {
            target: { value: "static" },
        });
        fireEvent.click(getByText(lanContainer, "Save"));
        expect(mockAxios.post).toBeCalled();
        const data = {
            mode: "unmanaged",
            mode_unmanaged: {
                lan_type: "static",
                lan_static: {
                    gateway: "192.168.1.4",
                    ip: "192.168.1.4",
                    netmask: "255.255.255.0",
                },
            },
        };
        expect(mockAxios.post).toHaveBeenCalledWith(
            "/reforis/api/lan",
            data,
            expect.anything()
        );
    });

    it("Test post unmanaged none.", () => {
        fireEvent.change(getByLabelText(lanContainer, "IPv4 protocol"), {
            target: { value: "none" },
        });
        fireEvent.click(getByText(lanContainer, "Save"));
        expect(mockAxios.post).toBeCalled();
        const data = {
            mode: "unmanaged",
            mode_unmanaged: { lan_none: undefined, lan_type: "none" },
        };
        expect(mockAxios.post).toHaveBeenCalledWith(
            "/reforis/api/lan",
            data,
            expect.anything()
        );
    });

    it("Test post managed.", () => {
        fireEvent.change(getByLabelText(lanContainer, "LAN mode"), {
            target: { value: "managed" },
        });
        fireEvent.click(getByText(lanContainer, "Save"));
        expect(mockAxios.post).toBeCalled();
        const data = {
            mode: "managed",
            mode_managed: {
                dhcp: { enabled: false },
                netmask: "255.255.255.0",
                router_ip: "192.168.1.4",
            },
        };
        expect(mockAxios.post).toHaveBeenCalledWith(
            "/reforis/api/lan",
            data,
            expect.anything()
        );
    });

    describe("LAN is managed and DHCP is enabled", () => {
        let changeMaxLeases;
        let changeStart;

        beforeEach(() => {
            fireEvent.change(getByLabelText(lanContainer, "LAN mode"), {
                target: { value: "managed" },
            });
            fireEvent.click(getByText(lanContainer, "Enable DHCP"));

            changeMaxLeases = (value) =>
                fireEvent.change(
                    getByLabelText(lanContainer, "DHCP max leases"),
                    { target: { value } }
                );
            changeStart = (value) =>
                fireEvent.change(getByLabelText(lanContainer, "DHCP start"), {
                    target: { value },
                });
        });

        it("should send post request", () => {
            fireEvent.click(getByText(lanContainer, "Save"));
            expect(mockAxios.post).toBeCalled();
            const data = {
                mode: "managed",
                mode_managed: {
                    dhcp: {
                        enabled: true,
                        lease_time: 43200,
                        limit: 150,
                        start: "192.168.1.10",
                    },
                    netmask: "255.255.255.0",
                    router_ip: "192.168.1.4",
                },
            };
            expect(mockAxios.post).toHaveBeenCalledWith(
                "/reforis/api/lan",
                data,
                expect.anything()
            );
        });

        it("should validate router's IP", async () => {
            const addressInput = getByLabelText(
                lanContainer,
                "Router IP address"
            );
            const changeAddress = (value) =>
                fireEvent.change(addressInput, { target: { value } });

            changeAddress("");
            await wait(() => {
                expect(
                    getByText(lanContainer, "This field is required.")
                ).toBeDefined();
            });

            changeAddress("999.999.999.999");
            await wait(() => {
                expect(
                    getByText(lanContainer, "This is not a valid IPv4 address.")
                ).toBeDefined();
            });
        });

        it("should validate network mask", async () => {
            const maskInput = getByLabelText(lanContainer, "Network mask");
            const changeMask = (value) =>
                fireEvent.change(maskInput, { target: { value } });

            changeMask("");
            await wait(() => {
                expect(
                    getByText(lanContainer, "This field is required.")
                ).toBeDefined();
            });

            changeMask("999.999.999.999");
            await wait(() => {
                expect(
                    getByText(lanContainer, "This is not a valid IPv4 address.")
                ).toBeDefined();
            });

            changeMask("9.9.9.9");
            await wait(() => {
                expect(
                    getByText(lanContainer, "This is not a valid network mask.")
                ).toBeDefined();
            });
        });

        it("should validate lease time", async () => {
            const timeInput = getByLabelText(
                lanContainer,
                "Lease time (hours)"
            );
            const changeTime = (value) =>
                fireEvent.change(timeInput, { target: { value } });
            changeTime(0);
            await wait(() => {
                expect(
                    getByText(lanContainer, "Minimum lease time is 1 hour.")
                ).toBeDefined();
            });
        });

        it("should validate start address", async () => {
            changeStart("");
            await wait(() => {
                expect(
                    getByText(lanContainer, "This field is required.")
                ).toBeDefined();
            });
        });
    });
});
