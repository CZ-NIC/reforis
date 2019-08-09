from flask import jsonify, current_app, request
from flask_babel import gettext as _

from reforis.auth import _decode_password_to_base64
from reforis.foris_controller_api import InvalidRequest


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


views = [{
    'rule': '/password',
    'view_func': password,
    'methods': ['GET', 'POST']
}]
