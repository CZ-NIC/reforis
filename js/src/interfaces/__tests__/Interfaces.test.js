/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {render, act, wait, getByText, fireEvent, getByLabelText} from 'react-testing-library';

import {mockedWS} from '../../testUtils/mockWS';
import mockAxios from 'jest-mock-axios';
import Interfaces from '../Interfaces';
import {interfacesFixture} from './__fixtures__/interfaces';


describe('<Interfaces/>', () => {
    let interfacesContainer;

    beforeEach(async () => {
        const mockWebSockets = new mockedWS();
        const {container} = render(<Interfaces ws={mockWebSockets}/>);
        mockAxios.mockResponse({data: interfacesFixture()});
        await wait(() => getByText(container, 'LAN1'));
        interfacesContainer = container
    });

    it('Snapshot.', () => {
        expect(interfacesContainer).toMatchSnapshot();
    });

    it('Snapshot select interface.', () => {
        act(() => {
            fireEvent.click(getByText(interfacesContainer, 'LAN1'));
        });
        expect(interfacesContainer).toMatchSnapshot();
    });

    it('Snapshot after interface moving.', async () => {
        await act(async () => {
            await fireEvent.click(getByText(interfacesContainer, 'LAN1'));
            fireEvent.change(getByLabelText(interfacesContainer, 'Network'),{target: {value: 'lan'}});
        });
        expect(interfacesContainer).toMatchSnapshot();
    });
});
