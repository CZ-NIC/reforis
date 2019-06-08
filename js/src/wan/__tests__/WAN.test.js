/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {fireEvent, render, waitForElement} from 'customTestRender';
import diffSnapshot from 'snapshot-diff';
import {mockedWS} from 'mockWS';
import {wanSettingsFixture} from './__fixtures__/wanSettings';
import mockAxios from 'jest-mock-axios';

import WAN from '../WAN';


describe('<WAN/>', () => {
    let asFragment;
    let firstRender;
    let getByLabelText;

    beforeEach(async () => {
        const mockWebSockets = new mockedWS();
        const renderRes = render(<WAN ws={mockWebSockets}/>);
        mockAxios.mockResponse({data: wanSettingsFixture()});
        asFragment = renderRes.asFragment;
        getByLabelText = renderRes.getByLabelText;

        await waitForElement(() => renderRes.getByText('WAN IPv4'));
        firstRender = renderRes.asFragment();
    });

    it('Snapshot: WAN IPv4 dhcp, WAN IPv6 dhcp, MAC disabled', () => {
        expect(firstRender).toMatchSnapshot();
    });

    it('Snapshot WAN IPv4 (static).', () => {
        fireEvent.change(getByLabelText('IPv4 protocol'), {target: {value: 'static'}});
        expect(diffSnapshot(firstRender, asFragment())).toMatchSnapshot();
    });

    it('Snapshot WAN IPv4 (pppoe).', () => {
        fireEvent.change(getByLabelText('IPv4 protocol'), {target: {value: 'pppoe'}});
        expect(diffSnapshot(firstRender, asFragment())).toMatchSnapshot();
    });

    it('Snapshot WAN IPv6 (dhcpv6).', () => {
        fireEvent.change(getByLabelText('IPv6 protocol'), {target: {value: 'dhcpv6'}});
        expect(diffSnapshot(firstRender, asFragment())).toMatchSnapshot();
    });

    it('Snapshot WAN IPv6 (static).', () => {
        fireEvent.change(getByLabelText('IPv6 protocol'), {target: {value: 'static'}});
        expect(diffSnapshot(firstRender, asFragment())).toMatchSnapshot();
    });

    it('Snapshot WAN IPv6 (6to4).', () => {
        fireEvent.change(getByLabelText('IPv6 protocol'), {target: {value: '6to4'}});
        expect(diffSnapshot(firstRender, asFragment())).toMatchSnapshot();
    });

    it('Snapshot WAN IPv6 (6in4).', () => {
        fireEvent.change(getByLabelText('IPv6 protocol'), {target: {value: '6in4'}});
        expect(diffSnapshot(firstRender, asFragment())).toMatchSnapshot();
    });

    it('Snapshot WAN IPv6 (6in4), dynamic IPv4 handling enabled.', () => {
        fireEvent.change(getByLabelText('IPv6 protocol'), {target: {value: '6in4'}});
        firstRender = asFragment();

        fireEvent.click(getByLabelText('Dynamic IPv4 handling'));
        expect(diffSnapshot(firstRender, asFragment())).toMatchSnapshot();
    });

    it('Snapshot: MAC enabled', () => {
        fireEvent.click(getByLabelText('Custom MAC address'));
        expect(diffSnapshot(firstRender, asFragment())).toMatchSnapshot();
    });
});
