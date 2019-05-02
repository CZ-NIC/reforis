/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {render, waitForElement, act, fireEvent, getByText, getByLabelText, getByValue} from 'react-testing-library';

import {mockedWS} from '../../testUtils/mockWS';
import {wanSettingsFixture} from './__fixtures__/wanSettings';
import mockAxios from 'jest-mock-axios';

import WAN from '../WAN';

describe('<WAN/>', () => {
    let wanContainer;

    beforeEach(async () => {
        const mockWebSockets = new mockedWS();
        const {container} = render(<WAN ws={mockWebSockets}/>);
        mockAxios.mockResponse({data: wanSettingsFixture()});
        await waitForElement(() => getByText(container, 'WAN IPv4'));
        wanContainer = container
    });

    it('Snapshot: WAN IPv4 dhcp, WAN IPv6 dhcp, MAC disabled', () => {
        expect(wanContainer.firstChild).toMatchSnapshot();
    });

    it('Snapshot WAN IPv4 (static).', () => {
        act(() => {
            fireEvent.change(getByValue(wanContainer, 'dhcp').parentElement, {target: {value: 'static'}});
        });
        expect(wanContainer.firstChild).toMatchSnapshot();
    });
    it('Snapshot WAN IPv4 (pppoe).', () => {
        act(() => {
            fireEvent.change(getByValue(wanContainer, 'dhcp').parentElement, {target: {value: 'pppoe'}});
        });
        expect(wanContainer.firstChild).toMatchSnapshot();
    });

    it('Snapshot WAN IPv6 (dhcpv6).', () => {
        act(() => {
            fireEvent.change(getByValue(wanContainer, 'none').parentElement, {target: {value: 'dhcpv6'}});
        });
        expect(wanContainer.firstChild).toMatchSnapshot();
    });
    it('Snapshot WAN IPv6 (static).', () => {
        act(() => {
            fireEvent.change(getByValue(wanContainer, 'none').parentElement, {target: {value: 'static'}});
        });
        expect(wanContainer.firstChild).toMatchSnapshot();
    });
    it('Snapshot WAN IPv6 (6to4).', () => {
        act(() => {
            fireEvent.change(getByValue(wanContainer, 'none').parentElement, {target: {value: '6to4'}});
        });
        expect(wanContainer.firstChild).toMatchSnapshot();
    });
    it('Snapshot WAN IPv6 (6in4).', () => {
        act(() => {
            fireEvent.change(getByValue(wanContainer, 'none').parentElement, {target: {value: '6in4'}});
        });
        expect(wanContainer.firstChild).toMatchSnapshot();
    });
    it('Snapshot WAN IPv6 (6in4), dynamic IPv4 handling enabled.', async () => {
        await act(async () => {
            await fireEvent.change(getByValue(wanContainer, 'none').parentElement, {target: {value: '6in4'}});
            fireEvent.click(getByLabelText(wanContainer, 'Dynamic IPv4 handling'));
        });
        expect(wanContainer.firstChild).toMatchSnapshot();
    });

    it('Snapshot: MAC enabled', () => {
        act(() => {
            fireEvent.click(getByLabelText(wanContainer, 'Custom MAC address'));
        });
        expect(wanContainer.firstChild).toMatchSnapshot();
    });
});