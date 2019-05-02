/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {render} from 'react-testing-library';

import {mockedWS} from '../../testUtils/mockWS';
import mockAxios from 'jest-mock-axios';
import {notificationsFixture} from './__fixtures__/notifications';

import NotificationsDropdown from '../NotificationsDropdown/NotificationsDropdown';


describe('<NotificationsDropdown/>', () => {
    let notificationCenterContainer;

    beforeEach(() => {
        const mockWebSockets = new mockedWS();
        const {container} = render(<NotificationsDropdown ws={mockWebSockets}/>);
        mockAxios.mockResponse({data: notificationsFixture()});
        notificationCenterContainer = container
    });

    it('Test with snapshot', () => {
        expect(notificationCenterContainer.firstChild).toMatchSnapshot()
    })
});