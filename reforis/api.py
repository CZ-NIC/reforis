#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.
import base64
import json
from flask import Blueprint, current_app, request, jsonify

from reforis import _get_locale_from_backend
from reforis.auth import check_password, _decode_password_to_base64
from reforis.backend import ExceptionInBackend

api = Blueprint(
    'api',
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
        rv = dict(self.payload or ())
        rv['error'] = self.error
        return rv


@api.errorhandler(InvalidUsage)
def handle_invalid_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response


# TODO: make some wrapper to catch backend exceptions...

@api.route('/notifications', methods=['GET', 'POST'])
def notifications():
    try:
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
    except ExceptionInBackend as e:
        _process_backend_error(e)


@api.route('/notifications-settings', methods=['GET', 'POST'])
def notifications_settings():
    try:
        res = ''
        if request.method == 'GET':
            res = current_app.backend.perform('router_notifications', 'get_settings')
        elif request.method == 'POST':
            data = request.json
            res = current_app.backend.perform('router_notifications', 'update_email_settings', data)
        return jsonify(res)
    except ExceptionInBackend as e:
        _process_backend_error(e)


@api.route('/wifi', methods=['GET', 'POST'])
def wifi():
    return _foris_controller_settings_call('wifi')


@api.route('/lan', methods=['GET', 'POST'])
def lan():
    return _foris_controller_settings_call('lan')


@api.route('/wan', methods=['GET', 'POST'])
def wan():
    try:
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
    except ExceptionInBackend as e:
        _process_backend_error(e)


@api.route('/connection-test', methods=['GET'])
def connection_test():
    try:
        res = current_app.backend.perform(
            'wan',
            'connection_test_trigger',
            data={'test_kinds': ['ipv4', 'ipv6']}
        )
        return jsonify(res)
    except ExceptionInBackend as e:
        _process_backend_error(e)


@api.route('/password', methods=['GET', 'POST'])
def password():
    try:
        res = ''
        if request.method == 'GET':
            res = {'password_set': current_app.backend.perform('web', 'get_data')['password_ready']}
        elif request.method == 'POST':
            data = request.json
            res = {}
            if not data.get('foris_current_password', False) or not check_password(data['foris_current_password']):
                raise InvalidUsage('Wrong current password')

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
    except ExceptionInBackend as e:
        _process_backend_error(e)


@api.route('/region-and-time', methods=['GET', 'POST'])
def region_and_time():
    return _foris_controller_settings_call('time')


def _foris_controller_settings_call(module):
    try:
        res = ''
        if request.method == 'GET':
            res = current_app.backend.perform(module, 'get_settings')
        elif request.method == 'POST':
            data = request.json
            res = current_app.backend.perform(module, 'update_settings', data)
        return jsonify(res)
    except ExceptionInBackend as e:
        _process_backend_error(e)


def _process_backend_error(e):
    # TODO: logging...
    error = 'Remote Exception: %s' % e.remote_description
    extra = '%s' % json.dumps(e.query)
    trace = e.remote_stacktrace
    print('\nError: {}\nExtra: {}\nTrace: {}'.format(error, extra, trace))
