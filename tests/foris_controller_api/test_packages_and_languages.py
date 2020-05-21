#  Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

from http import HTTPStatus

from reforis.test_utils import mock_backend_response


def test_post_packages_updates_enabled(client):
    backend_response = {
        'updater': {
            'get_enabled': {
                'enabled': True,
            },
        },
    }
    with mock_backend_response(backend_response):
        response = client.post('/api/packages')
    assert response.status_code == HTTPStatus.OK


def test_post_packages_updates_disabled_error(client):
    backend_response = {
        'updater': {
            'get_enabled': {
                'enabled': False,
            },
        },
    }
    with mock_backend_response(backend_response):
        response = client.post('/api/packages')
    assert response.status_code == HTTPStatus.BAD_REQUEST


def test_post_language_packages_updates_enabled(client):
    backend_response = {
        'updater': {
            'get_enabled': {
                'enabled': True,
            },
        },
    }
    with mock_backend_response(backend_response):
        response = client.post('/api/language-packages')
    assert response.status_code == HTTPStatus.OK


def test_post_language_packages_updates_disabled_error(client):
    backend_response = {
        'updater': {
            'get_enabled': {
                'enabled': False,
            },
        },
    }
    with mock_backend_response(backend_response):
        response = client.post('/api/language-packages')
    assert response.status_code == HTTPStatus.BAD_REQUEST
