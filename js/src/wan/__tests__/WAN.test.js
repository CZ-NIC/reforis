/*
 * Copyright (C) 2019-2021 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import mockAxios from "jest-mock-axios";
import diffSnapshot from "snapshot-diff";

import { WebSockets } from "foris";
import {
    fireEvent,
    render,
    waitForElement,
    wait,
} from "foris/testUtils/customTestRender";
import { mockJSONError } from "foris/testUtils/network";

import { wanSettingsFixture } from "./__fixtures__/wanSettings";
import WAN from "../WAN";

describe("<WAN/>", () => {
    let asFragment;
    let firstRender;
    let getByLabelText;
    let getByText;

    beforeEach(async () => {
        const webSockets = new WebSockets();
        const renderRes = render(<WAN ws={webSockets} />);
        mockAxios.mockResponse({ data: wanSettingsFixture() });
        asFragment = renderRes.asFragment;
        getByLabelText = renderRes.getByLabelText;
        getByText = renderRes.getByText;

        await waitForElement(() => renderRes.getByText("IPv4 Settings"));
        firstRender = renderRes.asFragment();
    });

    it("should handle error", async () => {
        const webSockets = new WebSockets();
        const { getByText } = render(<WAN ws={webSockets} />);
        mockJSONError();
        await wait(() => {
            expect(
                getByText("An error occurred while fetching data.")
            ).toBeTruthy();
        });
    });

    it("Snapshot: WAN IPv4 dhcp, WAN IPv6 dhcp, MAC disabled", () => {
        expect(firstRender).toMatchSnapshot();
    });

    it("Snapshot WAN IPv4 (static).", () => {
        fireEvent.change(getByLabelText("IPv4 protocol"), {
            target: { value: "static" },
        });
        expect(diffSnapshot(firstRender, asFragment())).toMatchSnapshot();
    });

    it("Snapshot WAN IPv4 (pppoe).", () => {
        fireEvent.change(getByLabelText("IPv4 protocol"), {
            target: { value: "pppoe" },
        });
        expect(diffSnapshot(firstRender, asFragment())).toMatchSnapshot();
    });

    it("Snapshot WAN IPv6 (dhcpv6).", () => {
        fireEvent.change(getByLabelText("IPv6 protocol"), {
            target: { value: "dhcpv6" },
        });
        expect(diffSnapshot(firstRender, asFragment())).toMatchSnapshot();
    });

    it("Snapshot WAN IPv6 (static).", () => {
        fireEvent.change(getByLabelText("IPv6 protocol"), {
            target: { value: "static" },
        });
        expect(diffSnapshot(firstRender, asFragment())).toMatchSnapshot();
    });

    it("Snapshot WAN IPv6 (6to4).", () => {
        fireEvent.change(getByLabelText("IPv6 protocol"), {
            target: { value: "6to4" },
        });
        expect(diffSnapshot(firstRender, asFragment())).toMatchSnapshot();
    });

    it("Snapshot WAN IPv6 (6in4).", () => {
        fireEvent.change(getByLabelText("IPv6 protocol"), {
            target: { value: "6in4" },
        });
        expect(diffSnapshot(firstRender, asFragment())).toMatchSnapshot();
    });

    it("Snapshot WAN IPv6 (6in4), dynamic IPv4 handling enabled.", () => {
        fireEvent.change(getByLabelText("IPv6 protocol"), {
            target: { value: "6in4" },
        });
        firstRender = asFragment();

        fireEvent.click(getByText("Dynamic IPv4 handling"));
        expect(diffSnapshot(firstRender, asFragment())).toMatchSnapshot();
    });

    it("Snapshot: MAC enabled", () => {
        fireEvent.click(getByText("Custom MAC address"));
        expect(diffSnapshot(firstRender, asFragment())).toMatchSnapshot();
    });

    // Post form tests:
    it("Post: WAN IPv4 dhcp, WAN IPv6 dhcp, MAC disabled", () => {
        fireEvent.click(getByText("Save"));
        expect(mockAxios.post).toBeCalled();
        const data = {
            mac_settings: { custom_mac_enabled: false },
            wan6_settings: { wan6_type: "none" },
            wan_settings: { wan_dhcp: {}, wan_type: "dhcp" },
        };
        expect(mockAxios.post).toHaveBeenCalledWith(
            "/reforis/api/wan",
            data,
            expect.anything()
        );
    });

    it("Post WAN IPv4 (static).", () => {
        fireEvent.change(getByLabelText("IPv4 protocol"), {
            target: { value: "static" },
        });
        fireEvent.click(getByText("Save"));
        // IP address value is invalid, button is disabled.
        expect(mockAxios.post).toHaveBeenCalledTimes(0);
    });

    it("Post WAN IPv4 (pppoe).", () => {
        fireEvent.change(getByLabelText("IPv4 protocol"), {
            target: { value: "pppoe" },
        });
        fireEvent.click(getByText("Save"));
        // IP address value is invalid, button is disabled.
        expect(mockAxios.post).toHaveBeenCalledTimes(0);
    });

    it("Post WAN IPv6 (dhcpv6).", () => {
        fireEvent.change(getByLabelText("IPv6 protocol"), {
            target: { value: "dhcpv6" },
        });
        fireEvent.click(getByText("Save"));
        expect(mockAxios.post).toBeCalled();
        const data = {
            mac_settings: { custom_mac_enabled: false },
            wan6_settings: { wan6_dhcpv6: { duid: "" }, wan6_type: "dhcpv6" },
            wan_settings: { wan_dhcp: {}, wan_type: "dhcp" },
        };
        expect(mockAxios.post).toHaveBeenCalledWith(
            "/reforis/api/wan",
            data,
            expect.anything()
        );
    });

    it("Post WAN IPv6 (static).", () => {
        fireEvent.change(getByLabelText("IPv6 protocol"), {
            target: { value: "static" },
        });
        fireEvent.click(getByText("Save"));
        // IP address value is invalid, button is disabled.
        expect(mockAxios.post).toHaveBeenCalledTimes(0);
    });

    it("Post WAN IPv6 (6to4).", () => {
        fireEvent.change(getByLabelText("IPv6 protocol"), {
            target: { value: "6to4" },
        });
        fireEvent.click(getByText("Save"));

        expect(mockAxios.post).toHaveBeenCalledTimes(1);
    });

    it("Post WAN IPv6 (6in4).", () => {
        fireEvent.change(getByLabelText("IPv6 protocol"), {
            target: { value: "6in4" },
        });
        fireEvent.click(getByText("Save"));
        // Values is invalid, button is disabled.
        expect(mockAxios.post).toHaveBeenCalledTimes(0);
    });

    it("Post WAN IPv6 (6in4), dynamic IPv4 handling enabled.", () => {
        fireEvent.change(getByLabelText("IPv6 protocol"), {
            target: { value: "6in4" },
        });
        fireEvent.click(getByText("Dynamic IPv4 handling"));
        fireEvent.click(getByText("Save"));
        // IP address value is invalid, button is disabled.
        expect(mockAxios.post).toHaveBeenCalledTimes(0);
    });

    it("Post: MAC enabled", () => {
        fireEvent.click(getByText("Custom MAC address"));
        fireEvent.click(getByText("Save"));
        // MAC address value is invalid, button is disabled.
        expect(mockAxios.post).toHaveBeenCalledTimes(0);
    });
});
