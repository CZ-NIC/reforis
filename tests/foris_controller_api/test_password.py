#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

from unittest import mock

import pytest

API_ENDPOINT = '/api/password'
PASSWORD_TYPES = ['foris_password', 'root_password']


def test_no_data(client):
    response = client.post(API_ENDPOINT)
    assert response.status_code == 400


@pytest.mark.parametrize('password_type', PASSWORD_TYPES)
def test_update_password(client, password_type):
    data = _get_password_data(password_type)
    with mock.patch('reforis.foris_controller_api.modules.password.check_password', return_value=True):
        response = client.post(API_ENDPOINT, json=data)
    assert response.status_code == 200


@pytest.mark.parametrize('password_type', PASSWORD_TYPES)
def test_update_password_wrong_current_password(client, password_type):
    data = _get_password_data(password_type)
    with mock.patch('reforis.foris_controller_api.modules.password.check_password', return_value=False):
        response = client.post(API_ENDPOINT, json=data)
    assert response.status_code == 400


def _get_password_data(password_type):
    return {
        'foris_current_password': 'current_test_password',
        password_type: 'new_test_password'
    }
