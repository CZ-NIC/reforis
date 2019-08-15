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
import GuestNetwork from '../GuestNetwork';
import guestNetworkFixture from './__fixtures__/guestNetwork';


describe('<GuestNetwork/>', () => {
    let guestNetworkContainer;

    beforeEach(async () => {
        const mockWebSockets = new mockedWS();
        const {container} = render(<GuestNetwork ws={mockWebSockets} setFormValue={() => {}}/>);
        mockAxios.mockResponse({data: guestNetworkFixture()});
        await wait(() => getByLabelText(container, 'Enable'));
        guestNetworkContainer = container
    });

    it('Snapshot disabled.', () => {
        expect(guestNetworkContainer).toMatchSnapshot();
    });

    it('Snapshot enabled.', () => {
        fireEvent.click(getByLabelText(guestNetworkContainer, 'Enable'));
        expect(guestNetworkContainer).toMatchSnapshot();
    });

    it('Snapshot enabled DHCP.', () => {
        fireEvent.click(getByLabelText(guestNetworkContainer, 'Enable'));
        fireEvent.click(getByLabelText(guestNetworkContainer, 'Enable DHCP'));
        expect(guestNetworkContainer).toMatchSnapshot();
    });

    it('Snapshot enabled QoS.', () => {
        fireEvent.click(getByLabelText(guestNetworkContainer, 'Enable'));
        fireEvent.click(getByLabelText(guestNetworkContainer, 'Enable QoS'));
        expect(guestNetworkContainer).toMatchSnapshot();
    });

    it('Test post.', async () => {
        fireEvent.click(getByLabelText(guestNetworkContainer, 'Enable'));
        fireEvent.click(getByLabelText(guestNetworkContainer, 'Enable DHCP'));
        fireEvent.click(getByLabelText(guestNetworkContainer, 'Enable QoS'));
        fireEvent.click(getByText(guestNetworkContainer, 'Save'));

        expect(mockAxios.post).toBeCalled();
        const data = {
            "dhcp": {
                "enabled": true,
                "lease_time": 3600,
                "limit": 150,
                "start": 100,
            },
            "enabled": true,
            "ip": "10.111.222.1",
            "netmask": "255.255.255.0",
            "qos": {
                "enabled": true,
                "download": 1023,
                "upload": 1025,
            },
        };
        expect(mockAxios.post).toHaveBeenCalledWith('/api/guest-network', data, expect.anything());
    });
});
