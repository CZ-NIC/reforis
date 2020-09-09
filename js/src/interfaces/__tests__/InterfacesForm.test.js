/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import { render } from "foris/testUtils/customTestRender";
import { mockSetAlert } from "foris/testUtils/alertContextMock";

import { interfacesFixture } from "./__fixtures__/interfaces";
import InterfacesForm from "../InterfacesForm";

describe("<InterfacesForm/>", () => {
    it("should display alert on open ports", () => {
        render(<InterfacesForm formData={interfacesFixture(true)} />);
        expect(mockSetAlert).toBeCalledWith(
            "Ports are open on your WAN interface. It's better to reconfigure your interface settings to avoid security issues."
        );
    });
});
