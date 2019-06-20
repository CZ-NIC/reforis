/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {fireEvent, getByLabelText, getByText, render, wait} from 'customTestRender';

import {mockedWS} from 'mockWS';
import mockAxios from 'jest-mock-axios';
import {lanSettingsFixture} from './__fixtures__/lanSettings';

import LAN from '../LAN';
import {createPortalContainer} from 'portal';

describe('<LAN/>', () => {
    let lanContainer;

    beforeEach(async () => {
        createPortalContainer('lan_container');
        const mockWebSockets = new mockedWS();
        const {container} = render(<LAN ws={mockWebSockets}/>);
        mockAxios.mockResponse({data: lanSettingsFixture()});
        await wait(() => getByText(container, 'Save'));
        lanContainer = container
    });

    it('Snapshot unmanaged (dhcp).', () => {
        expect(lanContainer).toMatchSnapshot();
    });
    it('Snapshot unmanaged static.', () => {
        fireEvent.change(getByLabelText(lanContainer, 'IPv4 protocol'), {target: {value: 'static'}});
        expect(lanContainer).toMatchSnapshot();
    });
    it('Snapshot unmanaged none.', () => {
        fireEvent.change(getByLabelText(lanContainer, 'IPv4 protocol'), {target: {value: 'none'}});
        expect(lanContainer).toMatchSnapshot();
    });

    it('Snapshot managed.', () => {
        fireEvent.change(getByLabelText(lanContainer, 'LAN mode'), {target: {value: 'managed'}});
        expect(lanContainer).toMatchSnapshot();
    });

    it('Snapshot managed with enabled DHCP.', () => {
        fireEvent.change(getByLabelText(lanContainer, 'LAN mode'), {target: {value: 'managed'}});
        fireEvent.click(getByLabelText(lanContainer, 'Enable DHCP'));
        expect(lanContainer).toMatchSnapshot();
    });
});
