#  Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

from http import HTTPStatus

from flask import current_app, jsonify, request
from flask_babel import gettext as _

from reforis import _get_locale_from_backend


def notifications():
    """
    .. http:get:: /api/notifications
        Get list of the router notifications.
        See `foris-controller JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/foris-controller/blob/master/foris_controller_modules/router_notifications/schema/router_notifications.json>`_.

        Notifications are sorted by ``created_at`` in descending order (newest first). You can change the order with the
        `sort` parameter, i.e. ``notifications?sort=asc``.

        **Example response**:

        .. sourcecode:: http

            [
                {
                    msg: 'Notification message.',
                    id: '123-123',
                    created_at: '2000-02-01 00:00:00',
                    displayed: true,
                    severity: 'news'
                },
                ...
            ]

    .. http:post:: /api/notifications
        Dismiss notifications.
        See `foris-controller JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/foris-controller/blob/master/foris_controller_modules/router_notifications/schema/router_notifications.json>`_.

        **Example request**:

        .. sourcecode:: http

            {"ids" : ['123-123',...]}
    """
    response = None
    if request.method == 'GET':
        request_data = {'lang': _get_locale_from_backend(current_app)}
        response = current_app.backend.perform('router_notifications', 'list', request_data)
        sort = request.args.get('sort')
        if sort != 'asc':
            response['notifications'].reverse()
    elif request.method == 'POST':
        data = request.json
        response = current_app.backend.perform('router_notifications', 'mark_as_displayed', data)
    return jsonify(response)


def notifications_settings():
    """
    .. http:get:: /api/notifications-settings
        Get router notifications settings.
        See `foris-controller JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/blob/master/foris_controller_modules/router_notifications/schema/router_notifications.json>`_.

        **Example response**:

        .. sourcecode:: http

            {
                emails: {
                    common: {
                        "send_news": true,
                        "severity_filter": 1,
                        "to": ["some@example.com"]
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
                    "smtp_turris": {"sender_name": "turris"},
                    "smtp_type": "custom"
                },
                "reboots": {"delay": 3,"time": "03:30"}
                }
            }

    .. http:post:: /api/notifications-settings
        Set router notifications settings.
        See `foris-controller JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/blob/master/foris_controller_modules/router_notifications/schema/router_notifications.json>`_.
        For request example see `GET` method of this endpoint.
    """
    response = None
    if request.method == 'GET':
        response = current_app.backend.perform('router_notifications', 'get_settings')
    elif request.method == 'POST':
        data = request.json
        response = current_app.backend.perform('router_notifications', 'update_email_settings', data)
    return jsonify(response)


def send_test_notification():
    response = current_app.backend.perform(
        'router_notifications',
        'create',
        {
            'msg': _('''This is a testing notification.

Please note it would be sent to your e-mail address only if you set
the importance level to "Reboot or attention is required" or higher.'''),
            'severity': 'error',
            'immediate': True,
        },
    )

    if response['result']:
        return jsonify(_('The testing message has been sent, please check your inbox.')), HTTPStatus.OK

    return jsonify(
        _('Sending of the testing message failed, your configuration is possibly wrong.')
    ), HTTPStatus.INTERNAL_SERVER_ERROR


# pylint: disable=invalid-name
views = [
    {
        'rule': '/notifications',
        'view_func': notifications,
        'methods': ['GET', 'POST'],
    }, {
        'rule': '/notifications-settings',
        'view_func': notifications_settings,
        'methods': ['GET', 'POST'],
    }, {
        'rule': '/send-test-notification',
        'view_func': send_test_notification,
        'methods': ['POST'],
    }
]
