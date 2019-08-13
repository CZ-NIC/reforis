from flask import current_app, jsonify, request

from reforis import _get_locale_from_backend


def notifications():
    """
    .. http:get:: /api/notifications
        Get list of the router notifications.
        See `foris-controller JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/blob/master/foris_controller_modules/router_notifications/schema/router_notifications.json>`_.

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
        <https://gitlab.labs.nic.cz/turris/foris-controller/blob/master/foris_controller_modules/router_notifications/schema/router_notifications.json>`_.

        **Example request**:

        .. sourcecode:: http

            {"ids" : ['123-123',...]}
    """
    res = ''
    if request.method == 'GET':
        res = current_app.backend.perform(
            'router_notifications', 'list',
            {'lang': _get_locale_from_backend(current_app)}
        )
    elif request.method == 'POST':
        data = request.json
        res = current_app.backend.perform('router_notifications', 'mark_as_displayed', data)
    return jsonify(res)


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
    res = ''
    if request.method == 'GET':
        res = current_app.backend.perform(
            'router_notifications',
            'get_settings',
        )
    elif request.method == 'POST':
        data = request.json
        res = current_app.backend.perform('router_notifications', 'update_email_settings', data)
    return jsonify(res)


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
    }
]
