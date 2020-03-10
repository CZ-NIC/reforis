/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import {
    fireEvent, getByAltText, getByText, render, wait,
} from "foris/testUtils/customTestRender";
import mockAxios from "jest-mock-axios";
import { mockJSONError } from "foris/testUtils/network";
import { mockSetAlert } from "foris/testUtils/alertContextMock";

import WorkflowSelect from "../GuidePages/WorkflowSelect";
import { workflowFixture } from "./__fixtures__/workflowSelect";

describe("<WorkflowSelect/>", () => {
    let workflowSelectContainer;

    beforeEach(async () => {
        const { container } = render(<WorkflowSelect workflows={workflowFixture} next_step="password" />);
        await wait(() => getByText(container, "Guide Workflow"));
        workflowSelectContainer = container;
        window.location.assign = jest.fn();
    });

    it("Snapshot.", () => {
        expect(workflowSelectContainer).toMatchSnapshot();
    });

    it("Select min.", () => {
        fireEvent.click(getByAltText(workflowSelectContainer, "min"));
        expect(mockAxios.post).toHaveBeenCalledWith("/reforis/api/guide-workflow", { workflow: "min" }, expect.anything());
    });

    it("Select router.", () => {
        fireEvent.click(getByAltText(workflowSelectContainer, "router"));
        expect(mockAxios.post).toHaveBeenCalledWith("/reforis/api/guide-workflow", { workflow: "router" }, expect.anything());
    });

    it("Select local server.", () => {
        fireEvent.click(getByAltText(workflowSelectContainer, "bridge"));
        expect(mockAxios.post).toHaveBeenCalledWith("/reforis/api/guide-workflow", {workflow: "bridge"}, expect.anything());
    });

    it("handle POST error", async () => {
        fireEvent.click(getByAltText(workflowSelectContainer, "min"));
        mockJSONError();
        await wait(() => expect(mockSetAlert).toBeCalledWith("Cannot set workflow."));
    });
});
