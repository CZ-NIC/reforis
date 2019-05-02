#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

import flask
from unittest import mock

from reforis.auth import login_to_foris, logout_from_foris


def test_login(request_ctx):
    assert not hasattr(flask.session, 'logged')
    with mock.patch('reforis.auth.current_app.backend.perform', return_value={'status': 'good'}):
        login_to_foris('password')
    assert flask.session['logged']


def test_login_bad(request_ctx):
    assert not hasattr(flask.session, 'logged')
    with mock.patch('reforis.auth.current_app.backend.perform', return_value={'status': 'not good'}):
        login_to_foris('password')
    assert not hasattr(flask.session, 'logged')


def test_logout(request_ctx):
    assert not hasattr(flask.session, 'logged')
    logout_from_foris()
    assert not flask.session['logged']


def test_login_is_open(client):
    client.get('/logout')  # Make sure user is logged out.
    response = client.get('/login')
    assert response.status_code == 200


def test_login_redirect(client):
    client.get('/logout')  # Make sure user is logged out.
    response = client.get('/')
    assert response.status_code == 302
    assert '/login' in response.headers['Location']


def test_redirect_when_logged(client):
    response = client.get('/login')
    assert response.status_code == 302
    assert '/login' not in response.headers['Location']
