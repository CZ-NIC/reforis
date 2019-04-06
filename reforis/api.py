#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

import json
from flask import Blueprint, current_app, request, jsonify

from reforis import _get_locale_from_backend
from reforis.backend import ExceptionInBackend

api = Blueprint(
    'api',
    __name__,
    template_folder='templates',
    static_folder='static',
    url_prefix='/api'
)


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


@api.route('connection-test', methods=['GET'])
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
