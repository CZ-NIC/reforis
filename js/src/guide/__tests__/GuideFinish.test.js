/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
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
import { mockJSONError } from "foris/testUtils/network";
import { mockSetAlert } from "foris/testUtils/alertContextMock";

import mockAxios from "jest-mock-axios";
import GuideFinish from "../GuidePages/GuideFinish";

describe("<GuideFinish/> and useGuideFinish hook", () => {
    let guideFinishContainer;

    beforeEach(async () => {
        const { container } = render(<GuideFinish />);
        guideFinishContainer = container;
    });

    it("Snapshot.", () => {
        expect(guideFinishContainer).toMatchSnapshot();
    });

    it("useGuideFinish hook", () => {
        fireEvent.click(getByText(guideFinishContainer, "Continue"));
        expect(mockAxios.post).toHaveBeenCalledWith(
            "/reforis/api/finish-guide",
            undefined,
            expect.anything()
        );
    });

    it("handle POST error", async () => {
        fireEvent.click(getByText(guideFinishContainer, "Continue"));
        mockJSONError();
        await wait(() =>
            expect(mockSetAlert).toBeCalledWith(
                "Cannot mark guide as finished."
            )
        );
    });
});
