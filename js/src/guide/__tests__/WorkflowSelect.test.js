/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {fireEvent, getByAltText, getByText, render, wait} from 'customTestRender';
import mockAxios from 'jest-mock-axios';


import WorkflowSelect from '../WorkflowSelect';
import {workflowFixture} from './__fixtures__/workflowSelect';


describe('<WorkflowSelect/>', () => {
    let workflowSelectContainer;

    beforeEach(async () => {
        const {container} = render(<WorkflowSelect workflows={workflowFixture} next_step='password'/>);
        await wait(() => getByText(container, 'Guide workflow'));
        workflowSelectContainer = container
    });

    it('Snapshot.', () => {
        expect(workflowSelectContainer).toMatchSnapshot();
    });

    it('Select min.', () => {
        window.location.assign = jest.fn();
        fireEvent.click(getByAltText(workflowSelectContainer, 'min'));
        expect(mockAxios.post).toHaveBeenCalledWith('/api/guide-workflow', {workflow: 'min'}, expect.anything());
    });

    it('Select router.', () => {
        window.location.assign = jest.fn();
        fireEvent.click(getByAltText(workflowSelectContainer, 'router'));
        expect(mockAxios.post).toHaveBeenCalledWith('/api/guide-workflow', {workflow: 'router'}, expect.anything());
    });
});
