/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {fireEvent, render, wait} from 'customTestRender';

import {mockedWS} from 'mockWS';
import {wifiSettingsFixture} from './__fixtures__/wifiSettings';
import mockAxios from 'jest-mock-axios';

import WiFi from '../WiFi';
import diffSnapshot from "snapshot-diff";

describe('<WiFi/>', () => {
    let firstRender;
    let getAllByText;
    let asFragment;

    beforeEach(async () => {
        const mockWebSockets = new mockedWS();
        const renderRes = render(<WiFi ws={mockWebSockets}/>);
        asFragment = renderRes.asFragment;
        getAllByText = renderRes.getAllByText;
        mockAxios.mockResponse({data: wifiSettingsFixture()});
        await wait(() => renderRes.getByText('Module 1'));
        firstRender = renderRes.asFragment()
    });

    it('Snapshot both modules disabled.', () => {
        expect(firstRender).toMatchSnapshot();
    });

    it('Snapshot one module enabled.', () => {
        fireEvent.click(getAllByText('Enable')[0]);
        expect(diffSnapshot(firstRender, asFragment())).toMatchSnapshot();
    });

    it('Snapshot 2.4 GHz', () => {
        fireEvent.click(getAllByText('Enable')[0]);
        const enabledRender = asFragment();
        fireEvent.click(getAllByText('2.4')[0]);
        expect(diffSnapshot(enabledRender, asFragment())).toMatchSnapshot();
    });

    it('Snapshot guest network.', () => {
        fireEvent.click(getAllByText('Enable')[0]);
        const enabledRender = asFragment();
        fireEvent.click(getAllByText('Enable Guest Wifi')[0]);
        expect(diffSnapshot(enabledRender, asFragment())).toMatchSnapshot();
    });
});
