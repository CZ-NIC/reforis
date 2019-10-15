from flask import jsonify, current_app, request
from flask_babel import gettext as _

from reforis.auth import _decode_password_to_base64, check_password
from reforis.foris_controller_api import APIError


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
        if not data.get('foris_current_password', False) or not check_password(data['foris_current_password']):
            raise APIError(_('Wrong current password.'))

        new_password = _decode_password_to_base64(data['foris_password'])
        request_data = {'password': new_password}

        if data.get('foris_password', False):
            request_data['type'] = 'foris'
            response['foris_password'] = current_app.backend.perform('password', 'set', request_data)

        if data.get('root_password', False):
            request_data['type'] = 'system'
            response['root_password'] = current_app.backend.perform('password', 'set', request_data)

    return jsonify(response)


# pylint: disable=invalid-name
views = [{
    'rule': '/password',
    'view_func': password,
    'methods': ['GET', 'POST']
}]
