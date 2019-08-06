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

    it('Test post unmanaged dhcp.', async () => {
        fireEvent.click(getByText(lanContainer, 'Save'));
        expect(mockAxios.post).toBeCalled();
        const data = {mode: 'unmanaged', mode_unmanaged: {lan_dhcp: {}, lan_type: 'dhcp'}};
        expect(mockAxios.post).toHaveBeenCalledWith('/api/lan', data, expect.anything());
    });
    it('Test post unmanaged static.', async () => {
        fireEvent.change(getByLabelText(lanContainer, 'IPv4 protocol'), {target: {value: 'static'}});
        fireEvent.click(getByText(lanContainer, 'Save'));
        expect(mockAxios.post).toBeCalled();
        const data = {
            mode: 'unmanaged',
            mode_unmanaged: {
                lan_type: 'static',
                lan_static: {
                    gateway: '192.168.1.4',
                    ip: '192.168.1.4',
                    netmask: '255.255.255.0'
                },
            }
        };
        expect(mockAxios.post).toHaveBeenCalledWith('/api/lan', data, expect.anything());
    });
    it('Test post unmanaged none.', () => {
        fireEvent.change(getByLabelText(lanContainer, 'IPv4 protocol'), {target: {value: 'none'}});
        fireEvent.click(getByText(lanContainer, 'Save'));
        expect(mockAxios.post).toBeCalled();
        const data = {mode: 'unmanaged', mode_unmanaged: {lan_none: undefined, lan_type: 'none'}};
        expect(mockAxios.post).toHaveBeenCalledWith('/api/lan', data, expect.anything());
    });

    it('Test post managed.', () => {
        fireEvent.change(getByLabelText(lanContainer, 'LAN mode'), {target: {value: 'managed'}});
        fireEvent.click(getByText(lanContainer, 'Save'));
        expect(mockAxios.post).toBeCalled();
        const data = {
            mode: 'managed',
            mode_managed: {dhcp: {enabled: false}, netmask: '255.255.255.0', router_ip: '192.168.1.4'}
        };
        expect(mockAxios.post).toHaveBeenCalledWith('/api/lan', data, expect.anything());
    });

    it('Test post managed with enabled DHCP.', () => {
        fireEvent.change(getByLabelText(lanContainer, 'LAN mode'), {target: {value: 'managed'}});
        fireEvent.click(getByLabelText(lanContainer, 'Enable DHCP'));
        fireEvent.click(getByText(lanContainer, 'Save'));
        expect(mockAxios.post).toBeCalled();
        const data = {
            mode: 'managed',
            mode_managed: {
                dhcp: {enabled: true, lease_time: 43200, limit: 150, start: 123123},
                netmask: '255.255.255.0',
                router_ip: '192.168.1.4'
            }
        };
        expect(mockAxios.post).toHaveBeenCalledWith('/api/lan', data, expect.anything());
    });
});
