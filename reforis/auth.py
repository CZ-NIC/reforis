#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.
import base64

from flask import session, redirect, current_app, request


def login_to_foris(password):
    encoded_password = base64.b64encode(password.encode('utf-8')).decode('utf-8')
    res = current_app.backend.perform('password', 'check', {'password': encoded_password})

    # consider unset password as successful auth maybe set some session variable in this case
    if res['status'] in ('unset', 'good'):
        session['logged'] = True
        return True

    logout_from_foris()
    return False


def logout_from_foris():
    session['logged'] = False


def register_login_required(app):
    # pylint: disable=unused-variable,inconsistent-return-statements
    @app.before_request
    def require_login():
        # Do not delete session when user closes the browser.
        session.permanent = True


        # User is logged in.
        if session.get('logged', False):
            return

        # Static files are not protected. (Can happen only at dev env.)
        if request.endpoint == 'static':
            return

        view = current_app.view_functions.get(request.endpoint)

        # Not found page is not protected.
        if not view:
            return

        # Login view is not protected.
        if request.endpoint == 'Foris.login':
            return

        return redirect('/login')
