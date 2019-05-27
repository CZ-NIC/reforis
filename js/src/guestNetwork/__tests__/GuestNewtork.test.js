/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {render, act, wait, fireEvent, getByLabelText} from 'react-testing-library';

import {mockedWS} from '../../testUtils/mockWS';
import mockAxios from 'jest-mock-axios';
import GuestNetwork from '../GuestNetwork';
import guestNetworkFixture from './__fixtures__/guestNetwork';
import {createPortalContainer} from '../../testUtils/utils';


describe('<GuestNetwork/>', () => {
    let guestNetworkContainer;

    beforeEach(async () => {
        createPortalContainer('guest_network_container');

        const mockWebSockets = new mockedWS();
        const {container} = render(<GuestNetwork ws={mockWebSockets}/>);
        mockAxios.mockResponse({data: guestNetworkFixture()});
        await wait(() => getByLabelText(container, 'Enable'));
        guestNetworkContainer = container
    });

    it('Snapshot disabled.', () => {
        expect(guestNetworkContainer).toMatchSnapshot();
    });

    it('Snapshot enabled.', () => {
        act(() => {
            fireEvent.click(getByLabelText(guestNetworkContainer, 'Enable'));
        });
        expect(guestNetworkContainer).toMatchSnapshot();
    });

    it('Snapshot enabled DHCP.', async () => {
        await act(async () => {
            await fireEvent.click(getByLabelText(guestNetworkContainer, 'Enable'));
            fireEvent.click(getByLabelText(guestNetworkContainer, 'Enable DHCP'));
        });
        expect(guestNetworkContainer).toMatchSnapshot();
    });

    it('Snapshot enabled QoS.', async () => {
        await act(async () => {
            await fireEvent.click(getByLabelText(guestNetworkContainer, 'Enable'));
            fireEvent.click(getByLabelText(guestNetworkContainer, 'Enable QoS'));
        });
        expect(guestNetworkContainer).toMatchSnapshot();
    });
});
