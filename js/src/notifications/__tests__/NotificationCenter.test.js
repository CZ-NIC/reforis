/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */
import React from 'react';
import {render, waitForElement, getByText, act} from 'react-testing-library';

import {mockedWS} from '../../testUtils/mockWS';
import {notificationsFixture} from './__fixtures__/notifications';
import NotificationsCenter from '../NotificationsCenter/NotificationsCenter';
import {notificationsEmailSettingsFixure} from './__fixtures__/notificationsEmailSettings';

function mockFetch() {
    return jest.fn((url) => {
            return new Promise((resolve, reject) => {
                resolve({
                    ok: true,
                    json: () => {
                        if (url === '/api/notifications'){
                            return notificationsFixture();
                        }
                        else if (url === '/api/notifications-settings'){
                            return notificationsEmailSettingsFixure()
                        }
                    },
                });
            })
        }
    );
}

describe('<NotificationCenter/>', () => {
    let NotificationCenterContainer;
    beforeEach(async () => {
        const mockWebSockets = new mockedWS();
        global.fetch = mockFetch();
        const {container} = render(<NotificationsCenter ws={mockWebSockets}/>);
        // console.log(container);
        await waitForElement(() => getByText(container, 'Email notifications settings'));
        console.log(container);
        NotificationCenterContainer = container;
    });

    it('Test with snapshot.', () => {
        expect(NotificationCenterContainer.firstChild).toMatchSnapshot()
    })
});