from flask import current_app, jsonify

from .utils import _foris_controller_settings_call


def wifi():
    """
    .. http:get:: /api/wifi
        Get WiFI router settings.
        See ``get_settings`` action in the `foris-controller wifi module JSON schema
        <https://gitlab.nic.cz/turris/foris-controller/foris-controller/blob/master/foris_controller_modules/wifi/schema/wifi.json>`_.

    .. http:post:: /api/wifi
        Get WiFi router settings.
        See ``update_settings`` action in the `foris-controller wifi module JSON schema
        <https://gitlab.nic.cz/turris/foris-controller/foris-controller/blob/master/foris_controller_modules/wifi/schema/wifi.json>`_.
    """
    return _foris_controller_settings_call('wifi')


def wifi_reset():
    """
    .. http:get:: /api/wifi
        Reset WiFI router settings.
        See ``reset`` action in the `foris-controller wifi module JSON schema
        <https://gitlab.nic.cz/turris/foris-controller/foris-controller/blob/master/foris_controller_modules/wifi/schema/wifi.json>`_.

    """
    return jsonify(current_app.backend.perform('wifi', 'reset'))


# pylint: disable=invalid-name
views = [
    {
        'rule': '/wifi',
        'view_func': wifi,
        'methods': ['GET', 'POST']
    }, {
        'rule': '/wifi-reset',
        'view_func': wifi_reset,
        'methods': ['POST']
    }
]
