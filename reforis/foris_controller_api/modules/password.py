#  Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

from flask import current_app, jsonify, request
from flask_babel import gettext as _
from reforis.auth import _decode_password_to_base64, check_password
from reforis.utils import APIError

from .utils import validate_json


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
    response = {}
    if request.method == 'GET':
        response['password_set'] = current_app.backend.perform('web', 'get_data')['password_ready']

    elif request.method == 'POST':
        data = request.json
        validate_json(data, {'foris_current_password': str})

        if not check_password(data['foris_current_password']):
            raise APIError(_('Wrong current password.'), 400)

        if data.get('foris_password', False):
            response['foris_password'] = _update_password('foris', data['foris_password'])

        if data.get('root_password', False):
            response['root_password'] = _update_password('system', data['root_password'])

    return jsonify(response)


def _update_password(password_type: str, password: str) -> dict:
    new_password = _decode_password_to_base64(password)
    request_data = {'type': password_type, 'password': new_password}
    return current_app.backend.perform('password', 'set', request_data)


# pylint: disable=invalid-name
views = [{
    'rule': '/password',
    'view_func': password,
    'methods': ['GET', 'POST']
}]
