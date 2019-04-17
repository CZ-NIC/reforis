/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

export function notificationsFixture() {
    return {
        notifications: [{
            msg: 'Notification message.',
            id: '123-123',
            created_at: '2000-02-01 00:00:00',
            displayed: false,
            severity: 'news'
        }, {
            msg: 'Second notification message.',
            id: '123-124',
            created_at: '2000-02-01 00:00:00',
            displayed: false,
            severity: 'error'
        }, {
            msg: 'Displayed notification message.',
            id: '123-125',
            created_at: '2000-02-01 00:00:01',
            displayed: true,
            severity: 'error'
        }]
    }
}

export function notificationsEmailSettingsFixure() {
    return {
        emails: {
            common: {
                "send_news": true,
                "severity_filter": 1,
                "to": [
                    "some@example.com"
                ]
            },
            "enabled": true,
            "smtp_custom": {
                "from": "router@example.com",
                "host": "example.com",
                "password": "test_password",
                "port": 465,
                "security": "ssl",
                "username": "root"
            },
            "smtp_turris": {
                "sender_name": "turris"
            },
            "smtp_type": "custom"
        },
        "reboots": {
            "delay": 3,
            "time": "03:30"
        }
    }

}