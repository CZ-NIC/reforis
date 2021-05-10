#  Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
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
        ('guest-network', 'guest', 'get_settings', {
            'dhcp': {
                'enabled': True,
                'lease_time': 7200,
                'start': 100,
                'limit': 150
            },
            'ip': '192.168.2.4',
            'netmask': '255.255.255.0'
            }
        ),
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

        ('packages', 'updater', 'get_package_lists', None),
        ('packages', 'updater', 'get_enabled', None),
        ('language-packages', 'updater', 'get_languages', None),
        ('language-packages', 'updater', 'get_enabled', None),

        ('approvals', 'updater', 'get_settings', {
            'approval': {}, 'enabled': True, 'approval_settings': {'status': 'off'}
        }),

        ('about', 'about', 'get', {'serial': '1'}),

        ('guide', 'web', 'get_data', {'guide': {}, 'password_ready': False}),
        ('haas', 'haas', 'get_settings', {'token': '', 'enabled': False}),
        ('system/hostname', 'system', 'get_hostname', {'hostname': ''})
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
    'endpoint, module, action, request_data', [
        ('lan/set_client', 'lan', 'set_dhcp_client', {
            'ip': '192.168.1.15',
            'hostname':'whatever',
            'mac':'aa:7c:8d:62:2e:25'
        }),
        ('wifi-reset', 'wifi', 'reset', {}),
        ('connection-test', 'wan', 'connection_test_trigger', {}),
        ('dns/test', 'wan', 'connection_test_trigger', {}),
        ('ntp-update', 'time', 'ntpdate_trigger', {}),
        ('reboot', 'maintain', 'reboot', {}),
        ('system/hostname', 'system', 'set_hostname', {'hostname': 'moxeek'}),
        ('updates/run', 'updater', 'run', {}),
        ('guest-network', 'guest', 'update_settings',
            {
                'dhcp': {
                    'enabled': True,
                    'lease_time': 1,
                    'limit': 150,
                    'start': '192.168.1.1'
                },
                'enabled': True,
                'ip': '10.111.222.1',
                'netmask': '255.255.255.0',
                'qos': {
                    'enabled': False
                }
            }
        )
    ]
)
def test_api_post_endpoint_foris_controller_calls(client, endpoint, module, action, request_data):
    _test_api_endpoint_foris_controller_call(
        client,
        f'api/{endpoint}', 'post',
        module, action,
        request_data=request_data,
        response_data={'result': True}
    )
