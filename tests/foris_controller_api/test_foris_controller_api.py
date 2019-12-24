#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

import pytest

from reforis.test_utils import mock_backend_response


@pytest.mark.parametrize(
    'endpoint, module, action, response_data', [
        ('wan', 'wan', 'get_wan_status', {}),
        ('lan', 'lan', 'get_settings', {'mode': ''}),
        ('wifi', 'wifi', 'get_settings', None),
        ('dns', 'dns', 'get_settings', None),
        ('dns/forwarders', 'dns', 'list_forwarders', None),
        ('guest-network', 'guest', 'get_settings', None),
        ('interfaces', 'networks', 'get_settings', {'device': ''}),

        ('notifications', 'router_notifications', 'list', {'notifications': []}),
        ('notifications-settings', 'router_notifications', 'get_settings', None),
        ('region-and-time', 'time', 'get_settings', None),

        ('language', 'web', 'get_data', {'password_ready': True, 'language': 'en'}),
        ('languages', 'web', 'list_languages', {
            'web': {'get_data': {'password_ready': True}, 'list_languages': {'languages': []}}
        }),
        ('updates', 'updater', 'get_settings', {
            'updater': {'get_settings': {'approval': True, 'user_lists': [], 'languages': []}},
            'router_notifications': {'get_settings': {'reboots': {}}}
        }),
        ('packages', 'updater', 'get_settings', {'approval': True, 'approval_settings': {}}),
        ('approvals', 'updater', 'get_settings', {
            'approval': {}, 'enabled': True, 'approval_settings': {'status': 'off'}
        }),

        ('about', 'about', 'get', {'serial': '1'}),

        ('guide', 'web', 'get_data', {'guide': {}, 'password_ready': False}),
    ]
)
def test_api_get_endpoint_calls_foris_controller_module(client, endpoint, module, action, response_data):
    url = f'/api/{endpoint}'

    response_mock_data = {module: {action: response_data}}
    if type(response_data) is dict:
        response_mock_data.update(response_data)

    with mock_backend_response(response_mock_data) as mock_send:
        response = client.get(url)
    assert response.status_code == 200

    _check_called_foris_controller_module(mock_send, module, action)


@pytest.mark.parametrize(
    'endpoint, module, action', [
        ('wifi-reset', 'wifi', 'reset'),
        ('connection-test', 'wan', 'connection_test_trigger'),
        ('dns/test', 'wan', 'connection_test_trigger'),
        ('ntp-update', 'time', 'ntpdate_trigger'),
        ('reboot', 'maintain', 'reboot'),
        ('updates/run', 'updater', 'run'),
    ]
)
def test_api_post_endpoints_exist(client, endpoint, module, action):
    url = f'/api/{endpoint}'

    response_mock_data = {module: {action: {'result': True}}}
    with mock_backend_response(response_mock_data) as mock_send:
        response = client.post(url)

    assert response.status_code == 200
    _check_called_foris_controller_module(mock_send, module, action)


def _check_called_foris_controller_module(sender_mock, module, action):
    calls = [(call[1][0], call[1][1]) for call in sender_mock.mock_calls]
    assert (module, action) in calls
