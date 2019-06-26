/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */
import React from 'react';
import {fireEvent, getByText, queryByText, render, wait} from 'customTestRender';

import {mockedWS} from 'mockWS';
import mockAxios from 'jest-mock-axios';

import {notificationsFixture} from './__fixtures__/notifications';
import NotificationsDropdown from '../NotificationsDropdown/NotificationsDropdown';


describe('useNotifications hook.', () => {
    let mockWebSockets;
    let notificationsContainer;
    beforeEach(async () => {
        mockWebSockets = new mockedWS();
        const {container} = render(<NotificationsDropdown ws={mockWebSockets}/>);
        mockAxios.mockResponse({data: notificationsFixture()});
        await wait(() => getByText(container, 'Notifications'));
        notificationsContainer = container;
    });

    it('Fetch notifications.', () => {
        expect(mockAxios.get).toHaveBeenCalledTimes(1);
        expect(mockAxios.get).toHaveBeenCalledWith('/api/notifications', expect.anything());
    });

    it('Render notifications.', () => {
        const HTMLNotificationMessage = queryByText(notificationsContainer, 'Notification message.');
        expect(HTMLNotificationMessage).not.toBeNull();
    });

    it("Don't show displayed notifications.", () => {
        const HTMLnotificationMessage = queryByText(notificationsContainer, 'Displayed notification me...');
        expect(HTMLnotificationMessage).toBeNull();
    });

    it("Dismiss notification.", () => {
        expect(mockAxios.post).toHaveBeenCalledTimes(0);
        fireEvent.click(notificationsContainer.querySelector('[class="fas fa-times"]'));
        expect(mockAxios.post).toHaveBeenCalledTimes(1);
        let HTMLnotificationMessage = queryByText(notificationsContainer, 'Notification message.');
        expect(HTMLnotificationMessage).toBeNull();
        HTMLnotificationMessage = queryByText(notificationsContainer, 'Second notification messa...');
        expect(HTMLnotificationMessage).not.toBeNull();
    });

    it("Dismiss all notification.", () => {
        expect(mockAxios.post).toHaveBeenCalledTimes(0);
        fireEvent.click(getByText(notificationsContainer, 'Dismiss all'));
        expect(mockAxios.post).toHaveBeenCalledTimes(1);
        expect(mockAxios.post).toHaveBeenCalledWith('/api/notifications', {"ids": ["123-123", "123-124"]}, expect.anything());
        let HTMLnotificationMessage = queryByText(notificationsContainer, 'Notification message.');
        expect(HTMLnotificationMessage).toBeNull();
        HTMLnotificationMessage = queryByText(notificationsContainer, 'Second notification messa...');
        expect(HTMLnotificationMessage).toBeNull();
    });
});
