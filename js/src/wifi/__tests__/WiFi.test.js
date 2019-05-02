/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {render, waitForElement, act, fireEvent, getByText, getByLabelText} from 'react-testing-library';

import {mockedWS} from '../../testUtils/mockWS';
import {wifiSettingsFixture} from './__fixtures__/wifiSettings';
import mockAxios from 'jest-mock-axios';

import WiFi from '../WiFi';

describe('<WiFi/>', () => {
    let wifiContainer;

    beforeEach(async () => {
        const mockWebSockets = new mockedWS();
        const {container} = render(<WiFi ws={mockWebSockets}/>);
        mockAxios.mockResponse({data: wifiSettingsFixture()});
        await waitForElement(() => getByText(container, 'Module 1'));
        wifiContainer = container
    });

    it('Snapshot both modules disabled.', () => {
        expect(wifiContainer.firstChild).toMatchSnapshot();
    });
    it('Snapshot one module enabled.', () => {
        act(() => {
            fireEvent.click(getByLabelText(wifiContainer, 'Enable'));
        });
        expect(wifiContainer.firstChild).toMatchSnapshot();
    });
    it('Snapshot 2.4 GHz', async () => {
        await act(async () => {
            await fireEvent.click(getByLabelText(wifiContainer, 'Enable'));
            fireEvent.click(getByLabelText(wifiContainer, '2.4'));
        });
        expect(wifiContainer.firstChild).toMatchSnapshot();
    });
    it('Snapshot guest network.', async () => {
        await act(async () => {
            await fireEvent.click(getByLabelText(wifiContainer, 'Enable'));
            fireEvent.click(getByLabelText(wifiContainer, 'Enable Guest Wifi'));
        });
        expect(wifiContainer.firstChild).toMatchSnapshot();
    });
});