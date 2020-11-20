/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import mockAxios from "jest-mock-axios";
import { render, wait, getByText } from "foris/testUtils/customTestRender";

import AutomaticUpdatesCard from "../AutomaticUpdatesCard";
import DataCollectionCard from "../DataCollectionCard";
import DynamicFirewallCard from "../DynamicFirewallCard";
import NetmetrCard from "../NetmetrCard";
import OpenVPNClientsCard from "../OpenVPNClientsCard";

import {
    automaticUpdatesCardFixture,
    automaticUpdatesCardFixture2,
    dataCollectionCardFixture,
    dataCollectionCardFixture2,
    netmetrCardFixture,
    netmetrCardFixture2,
    openVPNClientsCardFixture,
    openVPNClientsCardFixture2,
} from "../../__tests__/__fixtures__/overview";

describe("<Cards/>", () => {
    describe("<AutomaticUpdatesCard/>", () => {
        it("Snapshot: activated", async () => {
            const { container } = render(<AutomaticUpdatesCard />);
            mockAxios.mockResponse({ data: automaticUpdatesCardFixture });
            await wait(() => getByText(container, "Automatic Updates"));

            expect(container).toMatchSnapshot();
        });

        it("Snapshot: disabled", async () => {
            const { container } = render(<AutomaticUpdatesCard />);
            mockAxios.mockResponse({ data: automaticUpdatesCardFixture2 });
            await wait(() => getByText(container, "Automatic Updates"));

            expect(container).toMatchSnapshot();
        });
    });

    describe("<DataCollectionCard/>", () => {
        it("Snapshot: activated", async () => {
            const { container } = render(<DataCollectionCard />);
            mockAxios.mockResponse({ data: dataCollectionCardFixture });
            await wait(() => getByText(container, "Data Collection"));

            expect(container).toMatchSnapshot();
        });

        it("Snapshot: disabled", async () => {
            const { container } = render(<DataCollectionCard />);
            mockAxios.mockResponse({ data: dataCollectionCardFixture2 });
            await wait(() => getByText(container, "Data Collection"));

            expect(container).toMatchSnapshot();
        });
    });

    describe("<DynamicFirewallCard/>", () => {
        const activated = () => true;
        const disabled = () => false;

        it("Snapshot: activated", () => {
            const { container } = render(
                <DynamicFirewallCard activated={activated()} />
            );
            expect(container).toMatchSnapshot();
        });

        it("Snapshot: disabled", () => {
            const { container } = render(
                <DynamicFirewallCard activated={disabled()} />
            );
            expect(container).toMatchSnapshot();
        });
    });

    describe("<NetmetrCard/>", () => {
        it("Snapshot: contains tests", async () => {
            const { container } = render(<NetmetrCard />);
            mockAxios.mockResponse({ data: netmetrCardFixture });
            await wait(() => getByText(container, "NetMetr"));

            expect(container).toMatchSnapshot();
        });

        it("Snapshot: empty", async () => {
            const { container } = render(<NetmetrCard />);
            mockAxios.mockResponse({ data: netmetrCardFixture2 });
            await wait(() => getByText(container, "NetMetr"));

            expect(container).toMatchSnapshot();
        });
    });

    describe("<OpenVPNClientsCard/>", () => {
        it("Snapshot: contains clients", async () => {
            const { container } = render(<OpenVPNClientsCard />);
            mockAxios.mockResponse({ data: openVPNClientsCardFixture });
            await wait(() => getByText(container, "OpenVPN Clients"));

            expect(container).toMatchSnapshot();
        });

        it("Snapshot: empty", async () => {
            const { container } = render(<OpenVPNClientsCard />);
            mockAxios.mockResponse({ data: openVPNClientsCardFixture2 });
            await wait(() => getByText(container, "OpenVPN Clients"));

            expect(container).toMatchSnapshot();
        });
    });
});
