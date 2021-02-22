/*
 * Copyright (C) 2019-2021 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import {
    render,
    fireEvent,
    getByText,
    wait,
} from "foris/testUtils/customTestRender";
import mockAxios from "jest-mock-axios";

import { mockSetAlert } from "foris/testUtils/alertContextMock";
import { ALERT_TYPES } from "foris";

import { exampleHash, exampleUpdate, delay } from "./__fixtures__/updates";
import UpdateApproval from "../UpdateApproval";

describe("<UpdateApproval/>", () => {
    const onSuccess = jest.fn();

    function renderUpdateApproval(update = exampleUpdate, delay = null) {
        const { container } = render(
            <UpdateApproval
                update={update}
                onSuccess={onSuccess}
                delay={delay}
            />
        );
        return container;
    }

    it("No updates awaiting", () => {
        const container = renderUpdateApproval({
            ...exampleUpdate,
            approvable: false,
        });
        expect(
            getByText(container, "There are no updates awaiting your approval.")
        ).toBeTruthy();
        expect(container).toMatchSnapshot();
    });

    it("Updates awaiting - snapshot", () => {
        const container = renderUpdateApproval();
        expect(container).toMatchSnapshot();
    });

    it("Delayed updates awaiting - alert with timestamp", () => {
        const container = renderUpdateApproval(exampleUpdate, delay);
        expect(
            getByText(
                container,
                /These updates are not going to be automatically installed before February 20, 2020 3:02 PM/i
            )
        ).toBeDefined();
        expect(container.childNodes[0].firstChild.innerHTML).toMatchSnapshot();
    });

    it("Updates resolution - install now", async () => {
        const container = renderUpdateApproval();
        fireEvent.click(getByText(container, "Install now"));
        expect(mockAxios.post).toHaveBeenCalledWith(
            "/reforis/api/approvals",
            { hash: exampleHash, solution: "grant" },
            expect.anything()
        );

        // Reload approvals when resolution is successful
        expect(onSuccess).not.toBeCalled();
        mockAxios.mockResponse({ data: {} });
        await wait(() => expect(onSuccess).toBeCalled());
        expect(mockSetAlert).toBeCalledWith(
            "Updates will be installed shortly.",
            ALERT_TYPES.SUCCESS
        );
    });

    it("Updates resolution - spinner", async () => {
        const container = renderUpdateApproval();
        fireEvent.click(getByText(container, "Install now"));
        expect(container).toMatchSnapshot();
    });
});
