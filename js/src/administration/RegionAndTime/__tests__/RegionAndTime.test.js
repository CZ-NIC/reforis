/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {getByText, render, wait} from 'react-testing-library'

import {regionAndTime} from './__fixtures__/regionAndTime';
import mockFetch from '../../../testUtils/mockFetch';
import RegionAndTime from '../RegionAndTime';

describe('<RegionAndTime/>', () => {
    let regionAndTimeContainer;

    beforeEach(async () => {
        global.fetch = mockFetch(regionAndTime());
        const {container} = render(<RegionAndTime/>);
        await wait(() => getByText(container, 'Region and time'));
        regionAndTimeContainer = container;
    });

    it('Snapshot', async () => {
        expect(regionAndTimeContainer).toMatchSnapshot();
    });
});