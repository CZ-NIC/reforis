#  Copyright (C) 2019-2021 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

"""
Set of authentication helpers.
"""

import base64

from flask import session, current_app, request, render_template


def login_to_foris(password):
    """Mark a session as `logged` if the password is correct.

    :param password: string
    :return: result: Session was logged.
    :rtype: bool
    """
    if check_password(password):
        session['logged'] = True
        return True

    logout_from_foris()
    return False


def check_password(password):
    """Check given password with ``foris-controller``.

    :return: result: Password is correct or not set.
    :rtype: bool
    """
    decoded_password = _decode_password_to_base64(password)
    res = current_app.backend.perform(
        'password', 'check', {'password': decoded_password})

    # Consider unset password as successful auth maybe set some session variable in this case
    return res['status'] in ('unset', 'good')


def _decode_password_to_base64(password):
    return base64.b64encode(password.encode('utf-8')).decode('utf-8')


def logout_from_foris():
    """Mark session as `unlogged`.

    :param password: string
    """
    session['logged'] = False


def is_user_logged() -> bool:
    """Determine whether user is logged in"""
    web_data = current_app.backend.perform('web', 'get_data')
    if not web_data['password_ready']:
        session['logged'] = True

    return session.get('logged', False)

