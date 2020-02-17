#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

import pytest

from reforis.test_utils import _test_api_endpoint_foris_controller_call


@pytest.mark.parametrize(
    'endpoint, module, action, response_data', [
        ('wan', 'wan', 'get_wan_status', {}),
        ('lan', 'lan', 'get_settings', {'mode': ''}),
        ('wifi', 'wifi', 'get_settings', None),
        ('dns', 'dns', 'get_settings', None),
        ('dns/forwarders', 'dns', 'list_forwarders', None),
        ('guest-network', 'guest', 'get_settings', {'dhcp': {'enabled': True, 'lease_time': 7200}}),
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
def test_api_get_endpoint_foris_controller_calls(client, endpoint, module, action, response_data):
    _test_api_endpoint_foris_controller_call(
        client,
        f'api/{endpoint}', 'get',
        module, action,
        response_data=response_data
    )


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
def test_api_post_endpoint_foris_controller_calls(client, endpoint, module, action):
    _test_api_endpoint_foris_controller_call(
        client,
        f'api/{endpoint}', 'post',
        module, action,
        response_data={'result': True}
    )
