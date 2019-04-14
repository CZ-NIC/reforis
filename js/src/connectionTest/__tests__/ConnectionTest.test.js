/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {act, render, waitForElement, getByText, fireEvent} from 'react-testing-library';

import {mockedWS} from '../../testUtils/mockWS';
import mockFetch from '../../testUtils/mockFetch';

import ConnectionTest from '../ConnectionTest';

describe('<ConnectionTest/>', () => {
    let connectionTestContainer;

    beforeEach(async () => {
        const mockWebSockets = new mockedWS();
        global.fetch = mockFetch({
            "ipv6": true,
            "ipv6_gateway": false,
            "ipv4": true,
            "ipv4_gateway": false,
            "dns": true,
            "dnssec": false
        });
        const {container} = render(<ConnectionTest ws={mockWebSockets}/>);
        await waitForElement(() => getByText(container, 'Test connection'));
        connectionTestContainer = container
    });

    it('Snapshot before connection test.', () => {
        expect(connectionTestContainer.firstChild).toMatchSnapshot()
    });

    it('Snapshot after connection test.', () => {
        act(() => {
            fireEvent.click(getByText(connectionTestContainer, 'Test connection'));
        });
        expect(connectionTestContainer.firstChild).toMatchSnapshot()
    })
});