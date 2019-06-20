#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

import base64

from flask import session, redirect, current_app, request, url_for


def login_to_foris(password):
    if check_password(password):
        session['logged'] = True
        return True

    logout_from_foris()
    return False


def check_password(password):
    decoded_password = _decode_password_to_base64(password)
    res = current_app.backend.perform('password', 'check', {'password': decoded_password})

    # consider unset password as successful auth maybe set some session variable in this case
    return res['status'] in ('unset', 'good')


def _decode_password_to_base64(password):
    return base64.b64encode(password.encode('utf-8')).decode('utf-8')


def logout_from_foris():
    session['logged'] = False


def register_login_required(app):
    # pylint: disable=unused-variable,inconsistent-return-statements
    @app.before_request
    def require_login():
        # Do not delete session when user closes the browser.
        session.permanent = True

        web_data = app.backend.perform('web', 'get_data')
        if not web_data['password_ready']:
            session['logged'] = True

        # User is logged in.
        if session.get('logged', False):
            return

        not_protected_endpoints = [
            'static',
            'Foris.login',
            'ForisAPI.health_check',
        ]
        if request.endpoint in not_protected_endpoints:
            return

        # Not found page is not protected.
        view = current_app.view_functions.get(request.endpoint)
        if not view:
            return

        return redirect(url_for('Foris.login'))
