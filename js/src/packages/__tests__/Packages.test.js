/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import diffSnapshot from 'snapshot-diff';

import {cleanup, render, wait} from 'customTestRender';
import mockAxios from 'jest-mock-axios';

import packagesFixture from './__fixtures__/packages';
import Packages from '../Packages';

describe('<Packages/>', () => {
    let firstRender;
    let queryByText;

    beforeEach(async () => {
        const renderRes = render(<Packages/>);
        queryByText = renderRes.queryByText;
        mockAxios.mockResponse({data: packagesFixture(true)});
        await wait(() => renderRes.getByLabelText('Enabled package title'));
        firstRender = renderRes.asFragment();
    });

    it('Updates enabled', () => {
        expect(firstRender).toMatchSnapshot()
    });

    it('Updates disabled', async () => {
        cleanup();
        const {getByLabelText, asFragment} = render(<Packages/>);
        mockAxios.mockResponse({data: packagesFixture(false)});
        await wait(() => getByLabelText('Enabled package title'));

        expect(diffSnapshot(firstRender, asFragment())).toMatchSnapshot();
    });


    it('Test hidden.', () => {
        const HTMLHiddenPackageMessage = queryByText('Hidden package msg');
        expect(HTMLHiddenPackageMessage).toBeNull();
    })
});
