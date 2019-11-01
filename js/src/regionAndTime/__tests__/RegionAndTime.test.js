/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';

import {fireEvent, getByText, render, wait} from "foris/testUtils/customTestRender";
import mockAxios from 'jest-mock-axios';
import {regionAndTime} from './__fixtures__/regionAndTime';

import RegionAndTime from '../RegionAndTime';
import API_URLs from 'common/API';
import { WebSockets } from "foris";

describe('<RegionAndTime/>', () => {
    let regionAndTimeContainer;

    beforeEach(async () => {
        const webSockets = new WebSockets();
        const {container} = render(<RegionAndTime ws={webSockets}/>);
        mockAxios.mockResponse({data: regionAndTime()});
        await wait(() => getByText(container, 'Region settings'));
        regionAndTimeContainer = container;
    });

    it('Snapshot', () => {
        expect(mockAxios.get).toHaveBeenCalledTimes(1);
        expect(mockAxios.get).toHaveBeenCalledWith(API_URLs.regionAndTime, expect.anything(),);
        expect(regionAndTimeContainer).toMatchSnapshot();
    });

    it('Post.', () => {
        fireEvent.click(getByText(regionAndTimeContainer, 'Save'));

        expect(mockAxios.post).toBeCalled();
        const data = {
            city: 'Prague',
            country: 'CZ',
            region: 'Europe',
            time_settings: {how_to_set_time: 'ntp'},
            timezone: 'CET-1CEST,M3.5.0,M10.5.0/3'
        };
        expect(mockAxios.post).toHaveBeenCalledWith('/api/region-and-time', data, expect.anything());
    });
});
