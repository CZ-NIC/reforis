#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

"""
The `ForisViews` Blueprint defines very simple views which render single pages with a template. These views don’t have
any logic in them because all further communication between client and server goes via AJAX calls using reForis API
which is done in `ForisAPI` Blueprint.
"""

from flask import Blueprint, current_app, redirect, render_template, request, session, url_for
from flask_babel import gettext as _

from reforis.auth import login_to_foris, logout_from_foris

# pylint: disable=invalid-name
views = Blueprint('Views', __name__)


# pylint: disable=unused-argument
@views.route('/', defaults={'path': ''})
@views.route('/<path:path>')
def index(path):
    """Main page."""
    return render_template('index.html')


@views.route('/login', methods=['GET', 'POST'])
def login():
    """
    .. http:get:: /login
        Login page

    .. http:post:: /login
        Perform login.

        **Example request**:

        .. sourcecode:: http

            {"password" : "foris_password"}
    """
    error_message = None
    if session.get('logged', False):
        return redirect(url_for('Views.index'))

    if request.method == 'POST':
        password = request.form['password']
        if login_to_foris(password):
            return redirect(url_for('Views.index'))
        error_message = _('Wrong password.')
    return render_template('login.html', error_message=error_message)


@views.route('/logout', methods=['GET'])
def logout():
    """Logout from foris."""
    logout_from_foris()
    return redirect(url_for('Views.login'))


# pylint: disable=inconsistent-return-statements
@views.before_request
def guide_redirect():
    if request.endpoint in ['Views.logout', 'Views.login']:
        return
    web_data = current_app.backend.perform('web', 'get_data')
    if web_data['guide']['enabled']:
        return redirect(url_for('ForisGuide.index'))


@views.after_request
def remove_old_foris_ws_cookie(response):
    """
    It just fixes bug with infinity page refreshing loop. It can be deleted when old WS auth approach is disabled.
    """
    for cookie in ('foris.ws.session', 'foris.session'):
        delete_cookie(response, cookie)
    return response


def delete_cookie(response, cookie_name):
    if cookie_name in request.cookies:
        response.set_cookie(cookie_name, '', expires=0)
