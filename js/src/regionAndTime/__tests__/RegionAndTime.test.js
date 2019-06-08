/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';

import {getByText, render, wait} from 'customTestRender';
import mockAxios from 'jest-mock-axios';
import {regionAndTime} from './__fixtures__/regionAndTime';

import RegionAndTime from '../RegionAndTime';
import API_URLs from '../../common/API';

describe('<RegionAndTime/>', () => {
    let regionAndTimeContainer;

    beforeEach(async () => {
        const {container} = render(<RegionAndTime/>);
        mockAxios.mockResponse({data: regionAndTime()});
        await wait(() => getByText(container, 'Region settings'));
        regionAndTimeContainer = container;
    });

    it('Snapshot', () => {
        expect(mockAxios.get).toHaveBeenCalledTimes(1);
        expect(mockAxios.get).toHaveBeenCalledWith(API_URLs.regionAndTime, expect.anything(),);
        expect(regionAndTimeContainer).toMatchSnapshot();
    });
});
