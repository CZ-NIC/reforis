/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';

import {fireEvent, getByLabelText, getByText, render, wait} from 'customTestRender';
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
        expect(NotificationCenterContainer).toMatchSnapshot()
    });

    it('Disabled', () => {
        fireEvent.click(getByLabelText(NotificationCenterContainer, ENABLE_CHECKBOX_LABEL));
        expect(NotificationCenterContainer).toMatchSnapshot()
    });

    it('Enabled,smtp_type:turris', () => {
        fireEvent.click(getByLabelText(NotificationCenterContainer, 'Turris'));
        expect(NotificationCenterContainer).toMatchSnapshot()
    });

    it('Post.', () => {
        fireEvent.click(getByText(NotificationCenterContainer, 'Save'));

        expect(mockAxios.post).toBeCalled();
        const data = {
            common: {send_news: true, severity_filter: 1, to: ['some@example.com']},
            enabled: true,
            smtp_custom: {
                from: 'router@example.com',
                host: 'example.com',
                password: 'test_password',
                port: 465,
                security: 'ssl',
                username: 'root'
            },
            smtp_type: 'custom'
        };
        expect(mockAxios.post).toHaveBeenCalledWith('/api/notifications-settings', data, expect.anything());
    });

    it('Post smtp_type:turris.', () => {
        fireEvent.click(getByLabelText(NotificationCenterContainer, 'Turris'));
        fireEvent.click(getByText(NotificationCenterContainer, 'Save'));

        expect(mockAxios.post).toBeCalled();
        const data = {
            common: {send_news: true, severity_filter: 1, to: ['some@example.com']},
            enabled: true,
            smtp_type: 'turris',
            smtp_turris: {sender_name: 'turris'}
        };
        expect(mockAxios.post).toHaveBeenCalledWith('/api/notifications-settings', data, expect.anything());
    });

    it('Post disabled.', () => {
        fireEvent.click(getByLabelText(NotificationCenterContainer, ENABLE_CHECKBOX_LABEL));
        fireEvent.click(getByText(NotificationCenterContainer, 'Save'));

        expect(mockAxios.post).toBeCalled();
        const data = {enabled: false};
        expect(mockAxios.post).toHaveBeenCalledWith('/api/notifications-settings', data, expect.anything());
    });
});
