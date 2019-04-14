/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {render} from 'react-testing-library';

import mockFetch from '../../testUtils/mockFetch';
import {mockedWS} from '../../testUtils/mockWS';
import {notificationsFixture} from './__fixtures__/notifications';

import NotificationsDropdown from '../NotificationsDropdown';


describe('<NotificationsDropdown/>', () => {
    let NotificationCenterContainer;

    beforeEach(() => {
        const mockWebSockets = new mockedWS();
        global.fetch = mockFetch(notificationsFixture());
        const {container} = render(<NotificationsDropdown ws={mockWebSockets}/>);
        NotificationCenterContainer = container
    });

    it('Test with snapshot', () => {
        expect(NotificationCenterContainer.firstChild).toMatchSnapshot()
    })
});