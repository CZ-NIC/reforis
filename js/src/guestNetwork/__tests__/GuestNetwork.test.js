/*
 * Copyright (C) 2019-2021 CZ.NIC z.s.p.o. (http://www.nic.cz/)
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
import GuestNetwork from "../GuestNetwork";
import {
    guestNetworkFixture,
    noInterfaceFixture,
    noInterfaceUpFixture,
    interfaceUpFixture,
} from "./__fixtures__/guestNetwork";
import {
    NO_INTERFACE_WARNING,
    NO_INTERFACE_UP_WARNING,
} from "../GuestNetworkNotification";

describe("<GuestNetwork/>", () => {
    let guestNetworkContainer;

    beforeEach(async () => {
        const webSockets = new WebSockets();
        const { container } = render(
            <GuestNetwork ws={webSockets} setFormValue={jest.fn()} />
        );
        mockAxios.mockResponse({ data: guestNetworkFixture });
        await wait(() => getByLabelText(container, "Enable Guest Network"));
        guestNetworkContainer = container;
    });

    it("should handle error", async () => {
        const webSockets = new WebSockets();
        const { getByText } = render(
            <GuestNetwork ws={webSockets} setFormValue={() => {}} />
        );
        mockJSONError();
        await wait(() => {
            expect(
                getByText("An error occurred while fetching data.")
            ).toBeTruthy();
        });
    });

    it("Snapshot disabled.", () => {
        expect(guestNetworkContainer).toMatchSnapshot();
    });

    it("Snapshot enabled.", () => {
        fireEvent.click(
            getByText(guestNetworkContainer, "Enable Guest Network")
        );
        expect(guestNetworkContainer).toMatchSnapshot();
    });

    it("Snapshot enabled DHCP.", () => {
        fireEvent.click(
            getByText(guestNetworkContainer, "Enable Guest Network")
        );
        fireEvent.click(getByText(guestNetworkContainer, "Enable DHCP"));
        expect(guestNetworkContainer).toMatchSnapshot();
    });

    it("Snapshot enabled QoS.", () => {
        fireEvent.click(
            getByText(guestNetworkContainer, "Enable Guest Network")
        );
        fireEvent.click(getByText(guestNetworkContainer, "Enable QoS"));
        expect(guestNetworkContainer).toMatchSnapshot();
    });

    describe("enabled DHCP and QoS", () => {
        let changeMaxLeases;
        let changeStart;

        beforeEach(() => {
            fireEvent.click(
                getByText(guestNetworkContainer, "Enable Guest Network")
            );
            fireEvent.click(getByText(guestNetworkContainer, "Enable DHCP"));
            fireEvent.click(getByText(guestNetworkContainer, "Enable QoS"));

            changeMaxLeases = (value) =>
                fireEvent.change(
                    getByLabelText(guestNetworkContainer, "DHCP max leases"),
                    { target: { value } }
                );
            changeStart = (value) =>
                fireEvent.change(
                    getByLabelText(guestNetworkContainer, "DHCP start"),
                    {
                        target: { value },
                    }
                );
        });

        it("should send post request", async () => {
            fireEvent.click(getByText(guestNetworkContainer, "Save"));

            expect(mockAxios.post).toBeCalled();
            const data = {
                dhcp: {
                    enabled: true,
                    lease_time: 3600,
                    limit: 150,
                    start: "10.111.222.100",
                },
                enabled: true,
                ip: "10.111.222.1",
                netmask: "255.255.255.0",
                qos: {
                    enabled: true,
                    download: 1023,
                    upload: 1025,
                },
            };
            expect(mockAxios.post).toHaveBeenCalledWith(
                "/reforis/api/guest-network",
                data,
                expect.anything()
            );
        });

        it("should validate router's IP", async () => {
            const addressInput = getByLabelText(
                guestNetworkContainer,
                "Router IP address"
            );
            const changeAddress = (value) =>
                fireEvent.change(addressInput, { target: { value } });

            changeAddress("");
            await wait(() => {
                expect(
                    getByText(guestNetworkContainer, "This field is required.")
                ).toBeDefined();
            });

            changeAddress("999.999.999.999");
            await wait(() => {
                expect(
                    getByText(
                        guestNetworkContainer,
                        "This is not a valid IPv4 address."
                    )
                ).toBeDefined();
            });
            expect(
                getByText(
                    guestNetworkContainer,
                    "Invalid network settings. DHCP settings can't be validated."
                )
            ).toBeDefined();
        });

        it("should validate network mask", async () => {
            const maskInput = getByLabelText(
                guestNetworkContainer,
                "Network mask"
            );
            const changeMask = (value) =>
                fireEvent.change(maskInput, { target: { value } });

            changeMask("");
            await wait(() => {
                expect(
                    getByText(guestNetworkContainer, "This field is required.")
                ).toBeDefined();
            });

            changeMask("999.999.999.999");
            await wait(() => {
                expect(
                    getByText(
                        guestNetworkContainer,
                        "This is not a valid IPv4 address."
                    )
                ).toBeDefined();
            });

            changeMask("9.9.9.9");
            await wait(() => {
                expect(
                    getByText(
                        guestNetworkContainer,
                        "This is not a valid network mask."
                    )
                ).toBeDefined();
            });
            expect(
                getByText(
                    guestNetworkContainer,
                    "Invalid network settings. DHCP settings can't be validated."
                )
            ).toBeDefined();
        });

        it("should validate lease time", async () => {
            const timeInput = getByLabelText(
                guestNetworkContainer,
                "Lease time (hours)"
            );
            const changeTime = (value) =>
                fireEvent.change(timeInput, { target: { value } });
            changeTime(0);
            await wait(() => {
                expect(
                    getByText(
                        guestNetworkContainer,
                        "Minimum lease time is 1 hour."
                    )
                ).toBeDefined();
            });
        });

        it("should validate start address", async () => {
            changeStart("");
            await wait(() => {
                expect(
                    getByText(guestNetworkContainer, "This field is required.")
                ).toBeDefined();
            });

            changeStart("999.999.999.999");
            await wait(() => {
                expect(
                    getByText(
                        guestNetworkContainer,
                        "This is not a valid IPv4 address."
                    )
                ).toBeDefined();
            });
            changeStart;

            changeStart("9.9.9.9");
            await wait(() => {
                expect(
                    getByText(
                        guestNetworkContainer,
                        "Address is outside current network."
                    )
                ).toBeDefined();
            });

            changeStart("10.111.222.0");
            await wait(() => {
                expect(
                    getByText(
                        guestNetworkContainer,
                        "Address is already reserved for other purposes."
                    )
                ).toBeDefined();
            });
            changeStart("10.111.222.255");
            await wait(() => {
                expect(
                    getByText(
                        guestNetworkContainer,
                        "Address is already reserved for other purposes."
                    )
                ).toBeDefined();
            });
        });

        it("should validate max lease", async () => {
            changeMaxLeases(-1);
            await wait(() => {
                expect(
                    getByText(guestNetworkContainer, "Value must be positive.")
                ).toBeDefined();
            });

            const originalError = console.error;
            console.error = jest.fn();
            changeMaxLeases("foobar");
            await wait(() => {
                expect(
                    getByText(guestNetworkContainer, "Value must be a number.")
                ).toBeDefined();
            });
            expect(console.error).toBeCalled();
            console.error = originalError;

            changeMaxLeases(300);
            await wait(() => {
                expect(
                    getByText(
                        guestNetworkContainer,
                        "Too many addresses requested. Set a lower number or change DHCP start."
                    )
                ).toBeDefined();
            });
        });

        // it("one lease, start address the same as router's", async () => {
        //     changeMaxLeases(1);
        //     changeStart(guestNetworkFixture.ip);
        //     await wait(() => {
        //         expect(getByText(guestNetworkContainer, "The only DHCP lease is the same as router's address. Increase limit or change start address.")).toBeDefined();
        //     });
        // });
    });
});

describe("Displaying of interface warning messages", () => {
    let guestNetworkContainer;
    let container;

    beforeEach(async () => {
        const webSockets = new WebSockets();
        ({ container } = render(
            <GuestNetwork ws={webSockets} setFormValue={jest.fn()} />
        ));
    });

    it("No interface & snapshot", async () => {
        mockAxios.mockResponse({ data: noInterfaceFixture });
        await wait(() => getByLabelText(container, "Enable Guest Network"));
        guestNetworkContainer = container;
        expect(
            guestNetworkContainer.childNodes[1].firstChild.innerHTML
        ).toEqual(NO_INTERFACE_WARNING);
        expect(guestNetworkContainer.childNodes[1]).toMatchSnapshot();
    });

    it("No interface up & snapshot", async () => {
        mockAxios.mockResponse({ data: noInterfaceUpFixture });
        await wait(() => getByLabelText(container, "Enable Guest Network"));
        guestNetworkContainer = container;
        expect(
            guestNetworkContainer.childNodes[1].firstChild.innerHTML
        ).toEqual(NO_INTERFACE_UP_WARNING);
        expect(guestNetworkContainer.childNodes[1]).toMatchSnapshot();
    });

    it("Interface up & snapshot", async () => {
        mockAxios.mockResponse({ data: interfaceUpFixture });
        await wait(() => getByLabelText(container, "Enable Guest Network"));
        guestNetworkContainer = container;
        expect(guestNetworkContainer.childNodes[1].firstChild).toEqual(null);
        expect(guestNetworkContainer.childNodes[1]).toMatchSnapshot();
    });
});
