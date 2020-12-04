from flask import jsonify, current_app

from .utils import _foris_controller_settings_call


def region_and_time():
    """
    .. http:get:: /api/region-and-time
        Get `region and time` router settings.
        See ``get_settings`` action in the `foris-controller time module JSON schema
        <https://gitlab.nic.cz/turris/foris-controller/foris-controller/blob/master/foris_controller_modules/time/schema/time.json>`_.

    .. http:post:: /api/region-and-time
        Set `region and time` router settings.
        **It's not possible to change some `packages` settings if automatic updates are disabled.**
        See ``update_settings`` action in the `foris-controller time module JSON schema
        <https://gitlab.nic.cz/turris/foris-controller/foris-controller/blob/master/foris_controller_modules/time/schema/time.json>`_.
    """
    return _foris_controller_settings_call('time')


def ntp_update():
    """
    .. http:get:: /api/region-and-time
        Request to trigger ntpdate.
        See ``ntpdate_trigger`` action in the `foris-controller time module JSON schema
        <https://gitlab.nic.cz/turris/foris-controller/blob/master/foris_controller_modules/time/schema/time.json>`_.
    """
    return jsonify(current_app.backend.perform('time', 'ntpdate_trigger'))


# pylint: disable=invalid-name
views = [
    {
        'rule': '/region-and-time',
        'view_func': region_and_time,
        'methods': ['GET', 'POST'],
    }, {
        'rule': '/ntp-update',
        'view_func': ntp_update,
        'methods': ['GET', 'POST'],
    }
]
