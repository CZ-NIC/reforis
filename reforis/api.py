#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

from flask import Blueprint, current_app, jsonify, request
from flask_babel import gettext as _

from reforis import _get_locale_from_backend
from reforis.auth import _decode_password_to_base64, check_password

api = Blueprint(  # pylint: disable=invalid-name
    'ForisAPI',
    __name__,
    template_folder='templates',
    static_folder='static',
    url_prefix='/api'
)


class InvalidUsage(Exception):
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


@api.errorhandler(InvalidUsage)
def handle_invalid_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response


@api.route('/notifications', methods=['GET', 'POST'])
def notifications():
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
    return _foris_controller_settings_call('wifi')


@api.route('/lan', methods=['GET', 'POST'])
def lan():
    return _foris_controller_settings_call('lan')


@api.route('/wan', methods=['GET', 'POST'])
def wan():
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
    return _foris_controller_settings_call('guest')


@api.route('/connection-test', methods=['GET'])
def connection_test():
    return jsonify(current_app.backend.perform('wan', 'connection_test_trigger', data={'test_kinds': ['ipv4', 'ipv6']}))


@api.route('/dns', methods=['GET', 'POST'])
def dns():
    return _foris_controller_settings_call('dns')


@api.route('/dns-test', methods=['GET'])
def dns_test():
    return jsonify(current_app.backend.perform('wan', 'connection_test_trigger', data={'test_kinds': ['dns']}))


@api.route('/updates', methods=['GET', 'POST'])
def updates():
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
            raise InvalidUsage(_("You can't set packages with disabled automatic updates."))
        data['enabled'] = True
        data['approval_settings'] = updater_settings['approval_settings']
        res = current_app.backend.perform('updater', 'update_settings', data)
    return jsonify(res)


@api.route('/password', methods=['GET', 'POST'])
def password():
    res = ''
    if request.method == 'GET':
        res = {'password_set': current_app.backend.perform('web', 'get_data')['password_ready']}
    elif request.method == 'POST':
        data = request.json
        res = {}
        if not data.get('foris_current_password', False) or not check_password(data['foris_current_password']):
            raise InvalidUsage(_('Wrong current password.'))

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
    return _foris_controller_settings_call('time')


@api.route('/time', methods=['GET'])
def time():
    return jsonify(current_app.backend.perform('time', 'get_router_time'))


@api.route('/reboot', methods=['GET'])
def reboot():
    return jsonify(current_app.backend.perform('maintain', 'reboot'))


@api.route('/health-check', methods=['GET'])
def health_check():
    return jsonify(True)


def _foris_controller_settings_call(module):
    res = ''
    if request.method == 'GET':
        res = current_app.backend.perform(module, 'get_settings')
    elif request.method == 'POST':
        data = request.json
        res = current_app.backend.perform(module, 'update_settings', data)
    return jsonify(res)
