/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {render, act, fireEvent, getByLabelText} from 'react-testing-library';

import {dnsFixture} from './__fixtures__/dns';
import mockFetch from '../../testUtils/mockFetch';
import DNS from '../DNS';
import {mockedWS} from '../../testUtils/mockWS';


describe('<DNS/>', () => {
    let updatesContainer;
    beforeEach(() => {
        const mockWebSockets = new mockedWS();
        global.fetch = mockFetch(dnsFixture());
        const {container} = render(<DNS ws={mockWebSockets}/>);
        updatesContainer = container;
    });

    it('Test with snapshot.', () => {
        expect(updatesContainer).toMatchSnapshot()
    });

    it('Test with snapshot forwarding.', () => {
        act(() => {
            fireEvent.click(getByLabelText(updatesContainer, 'Use forwarding'));
        });
        expect(updatesContainer).toMatchSnapshot()
    });

    it('Test with snapshot DHCP.', () => {
        act(() => {
            fireEvent.click(getByLabelText(updatesContainer, 'Enable DHCP clients in DNS'));
        });
        expect(updatesContainer).toMatchSnapshot()
    });
});