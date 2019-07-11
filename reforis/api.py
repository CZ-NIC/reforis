#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

"""
The API is used for React reForis client application, which communicates with the Flask server via AJAX calls.

The design of the API is imposed by ``foris-controller``, and communication tasks between client-side application and
backend. In this case, the APIBlueprint serves as a layer between the foris-controller and a client application. It
passes required endpoints (sometimes with some adjustments) from Foris controller to the client application.

Mostly of the ``foris-controller`` endpoints which represent network, router system operations and Foris application
configurations has two actions: ``get_settings`` and ``set_settings``. These endpoints are ”translated” to particular
HTTP endpoint with ``GET`` and ``POST`` methods by appropriate actions.
"""

from flask import Blueprint, current_app, jsonify, request, make_response
from flask_babel import gettext as _

from reforis import _get_locale_from_backend
from reforis.auth import _decode_password_to_base64, check_password

# pylint: disable=invalid-name
api = Blueprint('ForisAPI', __name__, url_prefix='/api')


class InvalidRequest(Exception):
    """
    Raised when invalid request was received.
    """
    status_code = 400

    def __init__(self, error, status_code=None, payload=None):
        Exception.__init__(self)
        self.error = error
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        # pylint: disable=invalid-name
        rv = dict(self.payload or ())
        rv['error'] = self.error
        return rv


@api.errorhandler(InvalidRequest)
def handle_invalid_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response


@api.route('/languages', methods=['GET'])
def languages():
    """Get list of installed interface languages.

    **Example response**:

    .. sourcecode:: http

        ["en", "cz", "ru"]
    """
    return jsonify(current_app.backend.perform('web', 'list_languages')['languages'])


@api.route('/language', methods=['GET', 'POST'])
def language():
    """
    .. http:get:: /api/language
        Get a current language.

        **Example response**:

        .. sourcecode:: http

            "en"

    .. http:post:: /api/language
        Set a current language.

        **Example request**:

        .. sourcecode:: http

            {"language" : "en"}
    """
    res = ''
    if request.method == 'GET':
        res = current_app.backend.perform('web', 'get_data')['language']
    elif request.method == 'POST':
        res = current_app.backend.perform('web', 'set_language', request.json)
    return jsonify(res)


@api.route('/notifications', methods=['GET', 'POST'])
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


@api.route('/notifications-settings', methods=['GET', 'POST'])
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


@api.route('/wifi', methods=['GET', 'POST'])
def wifi():
    """
    .. http:get:: /api/wifi
        Get WiFI router settings.
        See ``get_settings`` action in the `foris-controller wifi module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/blob/master/foris_controller_modules/wifi/schema/wifi.json>`_.

    .. http:post:: /api/wifi
        Get WiFi router settings.
        See ``update_settings`` action in the `foris-controller wifi module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/blob/master/foris_controller_modules/wifi/schema/wifi.json>`_.
    """
    return _foris_controller_settings_call('wifi')


@api.route('/wifi-reset', methods=['POST'])
def wifi_reset():
    """
    .. http:get:: /api/wifi
        Reset WiFI router settings.
        See ``reset`` action in the `foris-controller wifi module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/blob/master/foris_controller_modules/wifi/schema/wifi.json>`_.

    """
    return jsonify(current_app.backend.perform('wifi', 'reset'))


@api.route('/lan', methods=['GET', 'POST'])
def lan():
    """
    .. http:get:: /api/lan
        Get LAN router settings.
        See ``get_settings`` action in the `foris-controller lan module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/blob/master/foris_controller_modules/lan/schema/lan.json>`_.

    .. http:post:: /api/lan
        Get LAN router settings.
        See ``update_settings`` action in the `foris-controller lan module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/blob/master/foris_controller_modules/lan/schema/lan.json>`_.
    """
    return _foris_controller_settings_call('lan')


@api.route('/wan', methods=['GET', 'POST'])
def wan():
    """
    .. http:get:: /api/wan
        Get WAN router settings.
        See ``get_settings`` action in the `foris-controller wan module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/blob/master/foris_controller_modules/wan/schema/wan.json>`_.

    .. http:post:: /api/wan
        Get WAN router settings.
        See ``update_settings`` action in the `foris-controller wan module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/blob/master/foris_controller_modules/wan/schema/wan.json>`_.
    """
    res = ''
    if request.method == 'GET':
        res = {
            **current_app.backend.perform('wan', 'get_settings'),
            **current_app.backend.perform('wan', 'get_wan_status')
        }
    elif request.method == 'POST':
        data = request.json
        res = current_app.backend.perform('wan', 'update_settings', data)
    return jsonify(res)


@api.route('/interfaces', methods=['GET', 'POST'])
def interfaces():
    """
    .. http:get:: /api/interfaces
        Get `network interfaces` router settings.
        See ``get_settings`` action in the `foris-controller networks module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/blob/master/foris_controller_modules/networks/schema/networks.json>`_.

    .. http:post:: /api/interfaces
        Get `network interfaces` router settings.
        See ``update_settings`` action in the `foris-controller networks module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/blob/master/foris_controller_modules/networks/schema/networks.json>`_.
    """
    module = 'networks'
    res = ''
    if request.method == 'GET':
        settings = current_app.backend.perform(module, 'get_settings')
        del settings['device']
        res = settings
    elif request.method == 'POST':
        data = request.json
        res = current_app.backend.perform(module, 'update_settings', data)
    return jsonify(res)


@api.route('/guest-network', methods=['GET', 'POST'])
def guest_network():
    """
    .. http:get:: /api/guest-network
        Get `guest network` router settings.
        See ``get_settings`` action in the `foris-controller guest module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/blob/master/foris_controller_modules/guest/schema/guest.json>`_.

    .. http:post:: /api/guest-network
        Get `guest network` router settings.
        See ``update_settings`` action in the `foris-controller guest module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/blob/master/foris_controller_modules/guest/schema/guest.json>`_.
    """
    return _foris_controller_settings_call('guest')


@api.route('/connection-test', methods=['POST'])
def connection_test():
    """
        Trigger WAN connection test . The results of the test is obtained via WebSockets.
        See ``connection_test_trigger``  action in the `foris-controller wan module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/blob/master/foris_controller_modules/wan/schema/wan.json>`_.
    """
    return jsonify(current_app.backend.perform('wan', 'connection_test_trigger', data={'test_kinds': ['ipv4', 'ipv6']}))


@api.route('/dns', methods=['GET', 'POST'])
def dns():
    """
    .. http:get:: /api/dns
        Get `guest network` router settings.
        See ``get_settings`` action in the `foris-controller dns module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/blob/master/foris_controller_modules/dns/schema/dns.json>`_.

    .. http:post:: /api/dns
        Get `dns network` router settings.
        See ``update_settings`` action in the `foris-controller dns module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/blob/master/foris_controller_modules/dns/schema/dns.json>`_.
    """
    return _foris_controller_settings_call('dns')


@api.route('/dns-test', methods=['POST'])
def dns_test():
    """
        Trigger DNS connection test . The results of the test is obtained via WebSockets.
        See ``connection_test_trigger`` action in the `foris-controller wan module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/blob/master/foris_controller_modules/wan/schema/wan.json>`_.
    """
    return jsonify(current_app.backend.perform('wan', 'connection_test_trigger', data={'test_kinds': ['dns']}))


@api.route('/updates', methods=['GET', 'POST'])
def updates():
    """
    .. http:get:: /api/updates
        Get `updates` router settings. It combines data from ``updater`` and ``router_notifications``
        ``foris-controller`` modules.

        **Example response**:

        .. sourcecode:: http

            {
                "approval_settings": {"status": "on"},
                "enabled": true,
                "reboots": { "delay": 4, "time": "04:30"}
            }

    .. http:post:: /api/updates
        Set `updates` router settings. It combines data from ``updater`` and ``router_notifications``
        ``foris-controller`` modules.

        **Example request**:

        .. sourcecode:: http

            {
                "approval_settings": {"status": "on"},
                "enabled": true,
                "reboots": { "delay": 4, "time": "04:30"}
            }
    """
    settings = current_app.backend.perform('updater', 'get_settings', {'lang': _get_locale_from_backend(current_app)})
    del settings['approval']

    res = None
    if request.method == 'GET':
        res = {
            **settings,
            'reboots': current_app.backend.perform('router_notifications', 'get_settings')['reboots'],
        }
        del res['user_lists']
        del res['languages']
    elif request.method == 'POST':
        # pylint: disable=fixme
        # TODO: If router_notifications is saved without errors and updater setting is saved with an error then user got
        # the error message even router_notifications are saved. It's probably better to make some rollback in case of
        # error here.
        data = request.json
        res_reboots = current_app.backend.perform('router_notifications', 'update_reboot_settings', data['reboots'])
        del data['reboots']

        if data['enabled']:
            data['user_lists'] = [
                package['name'] for package in settings['user_lists'] if package['enabled']
            ]
            data['languages'] = [
                language['code'] for language in settings['languages'] if language['enabled']
            ]

        res_updater = current_app.backend.perform('updater', 'update_settings', data)
        res = {'result': res_reboots and res_updater}
    return jsonify(res)


@api.route('/approvals', methods=['GET', 'POST'])
def approvals():
    """
    .. http:get:: /api/approvals
        Get list of `update approvals`.
    .. http:post:: /api/approvals
        Update or dismiss `update approvals`.
        See ``resolve_approval`` action in the `foris-controller updater module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/blob/master/foris_controller_modules/updater/schema/updater.json>`_.

        **Example request**:

        .. sourcecode:: http

            {
                "approval_settings": {"status": "on"},
                "enabled": true,
                "reboots": { "delay": 4, "time": "04:30"}
            }
    """
    res = None
    if request.method == 'GET':
        res = current_app.backend.perform(
            'updater', 'get_settings', {'lang': _get_locale_from_backend(current_app)}
        )['approval']

    elif request.method == 'POST':
        data = request.json
        res = current_app.backend.perform('updater', 'resolve_approval', data)

    return jsonify(res)


@api.route('/packages', methods=['GET', 'POST'])
def packages():
    """
    .. http:get:: /api/packages
        Get `packages` router settings.
        See ``get_settings`` action in the `foris-controller updater module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/blob/master/foris_controller_modules/updater/schema/updater.json>`_.

    .. http:post:: /api/packages
        Set `packages` router settings.
        **It's not possible to change some `packages` settings if automatic updates are disabled.**
        See ``update_settings`` action in the `foris-controller updater module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/blob/master/foris_controller_modules/updater/schema/updater.json>`_.
    """
    updater_settings = current_app.backend.perform(
        'updater',
        'get_settings',
        {'lang': _get_locale_from_backend(current_app)}
    )
    del updater_settings['approval']
    res = {}
    if request.method == 'GET':
        res = updater_settings
        del res['approval_settings']
    elif request.method == 'POST':
        data = request.json
        if not updater_settings['enabled']:
            raise InvalidRequest(_("You can't set packages with disabled automatic updates."))
        data['enabled'] = True
        data['approval_settings'] = updater_settings['approval_settings']
        res = current_app.backend.perform('updater', 'update_settings', data)
    return jsonify(res)


@api.route('/password', methods=['GET', 'POST'])
def password():
    """
    .. http:get:: /api/password
        Get information about current password is set or not.`.

        **Example request**:

        .. sourcecode:: http

            {"password_set": true}

    .. http:post:: /api/password
        Update `root` or `foris` password (or both).

        **Example request**:

        .. sourcecode:: http

            {
                "foris_current_password": "current_Foris_password",
                "newForisPassword":"new_Foris_password",
                "root_password": "root_Foris_password"
            }
    """
    res = ''
    if request.method == 'GET':
        res = {'password_set': current_app.backend.perform('web', 'get_data')['password_ready']}
    elif request.method == 'POST':
        data = request.json
        res = {}
        if not data.get('foris_current_password', False) or not check_password(data['foris_current_password']):
            raise InvalidRequest(_('Wrong current password.'))

        if data.get('foris_password', False):
            new_password = _decode_password_to_base64(data['foris_password'])
            res['foris_password'] = current_app.backend.perform('password', 'set', {
                'password': new_password,
                'type': 'foris'
            })
        if data.get('root_password', False):
            new_password = _decode_password_to_base64(data['root_password'])
            res['root_password'] = current_app.backend.perform('password', 'set', {
                'password': new_password,
                'type': 'foris'
            })
    return jsonify(res)


@api.route('/region-and-time', methods=['GET', 'POST'])
def region_and_time():
    """
    .. http:get:: /api/region-and-time
        Get `region and time` router settings.
        See ``get_settings`` action in the `foris-controller time module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/blob/master/foris_controller_modules/time/schema/time.json>`_.

    .. http:post:: /api/region-and-time
        Set `region and time` router settings.
        **It's not possible to change some `packages` settings if automatic updates are disabled.**
        See ``update_settings`` action in the `foris-controller time module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/blob/master/foris_controller_modules/time/schema/time.json>`_.
    """
    return _foris_controller_settings_call('time')


@api.route('/ntp-update', methods=['POST'])
def ntp_update():
    """
    .. http:get:: /api/region-and-time
        Request to trigger ntpdate.
        See ``ntpdate_trigger`` action in the `foris-controller time module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/blob/master/foris_controller_modules/time/schema/time.json>`_.
    """
    return jsonify(current_app.backend.perform('time', 'ntpdate_trigger'))


@api.route('/reboot', methods=['POST'])
def reboot():
    """
        Trigger device reboot.
        See ``reboot``  action in the `foris-controller maintain module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/blob/master/foris_controller_modules/maintain/schema/maintain.json>`_.
    """
    return jsonify(current_app.backend.perform('maintain', 'reboot'))


@api.route('/health-check', methods=['GET'])
def health_check():
    """Check if server is run."""
    resp = make_response(jsonify(True))
    resp.headers.add('Access-Control-Allow-Origin', '*')
    resp.headers.add('Access-Control-Allow-Methods', 'GET, OPTIONS')
    resp.headers.add('Access-Control-Allow-Headers', 'Origin, Accept, Content-Type, X-Requested-With')
    return resp


@api.route('/guide', methods=['GET'])
def guide():
    """Get guide steps."""
    res = {
        **current_app.backend.perform('web', 'get_data')['guide'],
        **current_app.backend.perform('web', 'get_guide'),
    }
    return jsonify(res)


@api.route('/finish-guide', methods=['POST'])
def finish_guide():
    """
        Skip guide.
        See ``update_guide``  action in the `foris-controller web module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/blob/master/foris_controller_modules/web/schema/web.json>`_.
    """
    return jsonify(current_app.backend.perform('web', 'update_guide', {'enabled': False}))


@api.route('/guide-workflow', methods=['POST'])
def guide_workflow():
    """
        Choose guide workflow.
        See ``update_guide``  action in the `foris-controller web module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/blob/master/foris_controller_modules/web/schema/web.json>`_.
    """
    data = request.json
    return jsonify(current_app.backend.perform('web', 'update_guide', {'enabled': True, **data}))


@api.route('/about', methods=['GET'])
def about():
    """
        About.
        See ``get``  action in the `foris-controller about module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/blob/master/foris_controller_modules/about/schema/about.json>`_.
    """
    return jsonify(**current_app.backend.perform('about', 'get'))


def _foris_controller_settings_call(module):
    """
    "Translate" typical ``foris-controller`` module to HTTP endpoint with ``GET`` and ``POST`` methods.

    **It works only inside the request context!**
    """
    res = ''
    if request.method == 'GET':
        res = current_app.backend.perform(module, 'get_settings')
    elif request.method == 'POST':
        data = request.json
        res = current_app.backend.perform(module, 'update_settings', data)
    return jsonify(res)
