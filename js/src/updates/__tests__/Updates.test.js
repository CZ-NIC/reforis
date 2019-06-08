/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {fireEvent, render, waitForElement} from 'customTestRender';

import {updatesFixture} from './__fixtures__/updates';
import Updates from '../Updates';
import mockAxios from 'jest-mock-axios';
import diffSnapshot from "snapshot-diff";

const ENABLE_CHECKBOX_LABEL = 'Enable automatic updates (recommended)';

describe('<Updates/>', () => {
    let firstRender;
    let getByLabelText;
    let asFragment;

    beforeEach(async () => {
        const renderRes = render(<Updates/>);
        mockAxios.mockResponse({data: updatesFixture()});
        asFragment = renderRes.asFragment;
        getByLabelText = renderRes.getByLabelText;

        await waitForElement(() => renderRes.getByLabelText(ENABLE_CHECKBOX_LABEL));
        firstRender = renderRes.asFragment();
    });

    it('Test with snapshot disabled.', () => {
        expect(firstRender).toMatchSnapshot()
    });

    it('Test with snapshot enabled.', () => {
        fireEvent.click(getByLabelText(ENABLE_CHECKBOX_LABEL));
        expect(diffSnapshot(firstRender, asFragment())).toMatchSnapshot();
    });

    it('Test with snapshot enabled, delayed.', () => {
        fireEvent.click(getByLabelText(ENABLE_CHECKBOX_LABEL));
        const enabledRender = asFragment();
        fireEvent.click(getByLabelText('Delayed updates'));
        expect(diffSnapshot(enabledRender, asFragment())).toMatchSnapshot();
    });
});
