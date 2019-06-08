/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */
import React from 'react';
import {render, wait} from 'customTestRender';

import mockAxios from 'jest-mock-axios';
import {mockedWS} from 'mockWS';
import {notificationsFixture} from './__fixtures__/notifications';

import Notifications from '../Notifications/Notifications';

describe('<Notifications/>', () => {
    let NotificationCenterContainer;
    beforeEach(async () => {
        const mockWebSockets = new mockedWS();
        const {container, getByText} = render(<Notifications ws={mockWebSockets}/>);
        mockAxios.mockResponse({data: notificationsFixture()});
        await wait(() => {
            getByText('Notification message.')
        });
        NotificationCenterContainer = container;
    });

    it('Test with snapshot.', () => {
        expect(NotificationCenterContainer.firstChild).toMatchSnapshot()
    })
});
