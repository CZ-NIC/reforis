/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */
import React from 'react';
import {render} from 'react-testing-library';

import {mockedWS} from '../../testUtils/mockWS';
import {notificationsFixture} from './__fixtures__/notifications';
import NotificationsCenter from '../NotificationsCenter/NotificationsCenter';
import {notificationsEmailSettingsFixure} from './__fixtures__/notificationsEmailSettings';
import mockAxios from 'jest-mock-axios';

describe('<NotificationCenter/>', () => {
    let NotificationCenterContainer;
    beforeEach(() => {
        const mockWebSockets = new mockedWS();
        const {container} = render(<NotificationsCenter ws={mockWebSockets}/>);
        mockAxios.mockResponse({data: notificationsEmailSettingsFixure()});
        mockAxios.mockResponse({data: notificationsFixture()});

        NotificationCenterContainer = container;
    });

    it('Test with snapshot.', () => {
        expect(NotificationCenterContainer.firstChild).toMatchSnapshot()
    })
});