/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {render, wait} from 'customTestRender';
import mockAxios from 'jest-mock-axios';

import mockedWS from 'mockWS';
import { notificationsFixture } from 'notifications/__tests__/__fixtures__/notifications.js';

import RebootDropdown from '../RebootDropdown';

describe('<RebootDropdown/>', () => {
    let rebootDropdownContainer;

    beforeEach(async () => {
        const mockWebSockets = new mockedWS();
        const {container, getByText} = render(<RebootDropdown ws={mockWebSockets}/>);
        mockAxios.mockResponse({data: notificationsFixture});
        rebootDropdownContainer = container;
        await wait(() => {
            getByText('Reboot required');
        });
    });

    it('Test with snapshot', () => {
        expect(rebootDropdownContainer).toMatchSnapshot();
    })
});
