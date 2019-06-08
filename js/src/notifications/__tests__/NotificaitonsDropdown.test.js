/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {render, wait} from 'customTestRender';

import {mockedWS} from 'mockWS';
import mockAxios from 'jest-mock-axios';
import {notificationsFixture} from './__fixtures__/notifications';

import NotificationsDropdown from '../NotificationsDropdown/NotificationsDropdown';


describe('<NotificationsDropdown/>', () => {
    let notificationCenterContainer;

    beforeEach(async () => {
        const mockWebSockets = new mockedWS();
        const {container, getByText} = render(<NotificationsDropdown ws={mockWebSockets}/>);
        mockAxios.mockResponse({data: notificationsFixture()});
        notificationCenterContainer = container
        await wait(() => {
            getByText('Notification message.')
        });
    });

    it('Test with snapshot', () => {
        expect(notificationCenterContainer.firstChild).toMatchSnapshot()
    })
});
