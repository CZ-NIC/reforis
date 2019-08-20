/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

export const notificationsFixture = {
    notifications: [
        {
            msg: 'Notification message.',
            id: '123-123',
            created_at: '2000-02-01 00:00:00',
            displayed: false,
            severity: 'news'
        },
        {
            msg: 'Second notification message.',
            id: '123-124',
            created_at: '2000-02-01 00:00:00',
            displayed: false,
            severity: 'error'
        },
        {
            msg: 'Third notification message.',
            id: '808-909',
            created_at: '2000-02-01 00:00:00',
            displayed: false,
            severity: 'restart'
        },
        {
            msg: 'Displayed notification message.',
            id: '123-125',
            created_at: '2000-02-01 00:00:01',
            displayed: true,
            severity: 'error'
        }
    ]
};
