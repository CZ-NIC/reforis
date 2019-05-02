/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {render, act, wait, getByText, fireEvent, getByLabelText, getByValue} from 'react-testing-library';

import {mockedWS} from '../../testUtils/mockWS';
import mockAxios from 'jest-mock-axios';
import {lanSettingsFixture} from './__fixtures__/lanSettings';

import LAN from '../LAN';

describe('<LAN/>', () => {
    let lanContainer;

    beforeEach(async () => {
        const mockWebSockets = new mockedWS();
        const {container} = render(<LAN ws={mockWebSockets}/>);
        mockAxios.mockResponse({data: lanSettingsFixture()});
        await wait(() => getByText(container, 'Save'));
        lanContainer = container
    });

    it('Snapshot unmanaged (dhcp).', () => {
        expect(lanContainer.firstChild).toMatchSnapshot();
    });
    it('Snapshot unmanaged static.', () => {
        act(() => {
            fireEvent.change(getByValue(lanContainer, 'dhcp').parentElement, {target: {value: 'static'}});
        });
        expect(lanContainer.firstChild).toMatchSnapshot();
    });
    it('Snapshot unmanaged none.', () => {
        act(() => {
            fireEvent.change(getByValue(lanContainer, 'dhcp').parentElement, {target: {value: 'none'}});
        });
        expect(lanContainer.firstChild).toMatchSnapshot();
    });

    it('Snapshot managed.', () => {
        act(() => {
            fireEvent.change(getByValue(lanContainer, 'unmanaged').parentElement, {target: {value: 'managed'}});
        });
        expect(lanContainer.firstChild).toMatchSnapshot();
    });

    it('Snapshot managed with enabled DHCP.', async () => {
        await act(async () => {
            await fireEvent.change(getByValue(lanContainer, 'unmanaged').parentElement, {target: {value: 'managed'}});
            fireEvent.click(getByLabelText(lanContainer, 'Enable DHCP'));
        });
        expect(lanContainer.firstChild).toMatchSnapshot();
    });

});