#  Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

from http import HTTPStatus

from reforis.test_utils import mock_backend_response


def test_post_updates_automatic_restart_error(client):
    backend_response = {
        'router_notifications': {
            'get_settings': {'reboots': {}},
            'update_reboot_settings': {'result': False},
        },
        'updater': {
            'get_settings': {
                'approval': {},
            },
        },
    }
    with mock_backend_response(backend_response):
        response = client.post('/api/updates', json={'reboots': {}, 'enabled': False})
    assert response.status_code == HTTPStatus.INTERNAL_SERVER_ERROR
    assert response.json == 'Cannot change automatic restart settings.'


def test_post_updates_approvals_error(client):
    backend_response = {
        'router_notifications': {
            'get_settings': {'reboots': {}},
            'update_reboot_settings': {'result': True},
        },
        'updater': {
            'update_settings': {'result': False},
            'get_settings': {
                'approval': {},
            },
        },
    }
    with mock_backend_response(backend_response):
        response = client.post('/api/updates', json={'reboots': {}, 'enabled': False})
    assert response.status_code == HTTPStatus.INTERNAL_SERVER_ERROR
    assert response.json == 'Cannot update approvals settings.'


def test_post_updates_approvals_error_updates_enabled(client):
    backend_response = {
        'router_notifications': {
            'get_settings': {'reboots': {}},
            'update_reboot_settings': {'result': True},
        },
        'updater': {
            'update_settings': {'result': False},
            'get_settings': {
                'approval': {},
                'user_lists': [{'name': 'Foobar', 'enabled': True}],
                'languages': [{'code': 'en-ie', 'enabled': True}],
            },
        },
    }
    with mock_backend_response(backend_response):
        response = client.post('/api/updates', json={'reboots': {}, 'enabled': True})
    assert response.status_code == HTTPStatus.INTERNAL_SERVER_ERROR
    assert response.json == 'Cannot update approvals settings.'
