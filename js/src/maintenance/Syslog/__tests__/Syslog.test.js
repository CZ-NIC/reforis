/*
 * Copyright (C) 2021 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import {
    fireEvent,
    getByText,
    render,
    wait,
} from "foris/testUtils/customTestRender";
import Syslog from "../Syslog";
import syslogFixture from "./__fixtures__/syslog";
import mockAxios from "jest-mock-axios";

describe("Syslog", () => {
    let syslogContainer;

    beforeEach(async () => {
        const { container } = render(<Syslog />);
        mockAxios.mockResponse({ data: syslogFixture });
        await wait(() => getByText(container, "System logs retention"));
        syslogContainer = container;
    });

    it("Snapshot form enabled", async () => {
        expect(syslogContainer).toMatchSnapshot();
    });

    it("Snapshot form disabled", async () => {
        const { container } = render(<Syslog />);
        mockAxios.mockResponse({ data: { disk_mounted: false } });
        await wait(() => getByText(container, "System logs retention"));
        syslogContainer = container;
        expect(syslogContainer).toMatchSnapshot();
    });

    it("Success post request", () => {
        fireEvent.click(getByText(syslogContainer, "Save"));
        expect(mockAxios.post).toHaveBeenCalledWith(
            "/reforis/storage/api/settings",
            { persistent_logs: true },
            expect.anything()
        );
    });
});
