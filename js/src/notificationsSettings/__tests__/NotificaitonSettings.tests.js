/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';

import {fireEvent, getByLabelText, render, wait} from 'customTestRender';
import {mockedWS} from 'mockWS';
import mockAxios from 'jest-mock-axios';
import notificationsSettings from './__fixtures__/notificationsSettings';

import NotificationsSettings from '../NotificationsSettings';

const ENABLE_CHECKBOX_LABEL = 'Enable email notifications';

describe('<NotificationsSettings/>', () => {
    let NotificationCenterContainer;

    beforeEach(async () => {
        const mockWebSockets = new mockedWS();
        const {container} = render(<NotificationsSettings ws={mockWebSockets}/>);
        mockAxios.mockResponse({data: notificationsSettings()});
        NotificationCenterContainer = container;
        await wait(() => getByLabelText(container, ENABLE_CHECKBOX_LABEL));

    });

    it('Enabled, smtp_type:custom', () => {
        expect(NotificationCenterContainer.firstChild).toMatchSnapshot()
    });

    it('Disabled', () => {
        fireEvent.click(getByLabelText(NotificationCenterContainer, ENABLE_CHECKBOX_LABEL));
        expect(NotificationCenterContainer.firstChild).toMatchSnapshot()
    });

    it('Enabled,smtp_type:turris', () => {
        fireEvent.click(getByLabelText(NotificationCenterContainer, 'Turris'));
        expect(NotificationCenterContainer.firstChild).toMatchSnapshot()
    })
});
