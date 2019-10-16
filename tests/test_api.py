#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

import pytest
from flask import current_app


@pytest.mark.parametrize(
    'endpoint, module, post_is_allowed', [
        ('wan', 'wan', True),
        ('lan', 'lan', True),
        ('wifi', 'wifi', True),
        ('dns', 'dns', True),
        ('dns/forwarder', 'dns', True),
        ('dns/forwarders', 'dns', False),
        ('guest-network', 'guest', True),
        ('interfaces', 'networks', True),

        ('notifications', 'router_notifications', True),
        ('notifications-settings', 'router_notifications', True),
        ('region-and-time', 'time', True),

        ('language', 'web', True),
        ('languages', 'web', False),
        ('updates', 'updater', True),
        ('packages', 'updater', True),
        ('approvals', 'updater', True),

        ('about', 'about', False),

        ('health-check', None, False),

        ('guide', 'web', False),
    ]
)
def test_api_endpoints_exist(client, endpoint, module, post_is_allowed):
    url = f'/api/{endpoint}'
    response = client.get(url)
    assert response.status_code == 200
    fake_json = {'reboots': {}, 'enabled': {}, 'mode': 'unmanaged'}
    response = client.post(url, json=fake_json)

    if post_is_allowed:
        assert response.status_code == 200
    else:
        assert response.status_code == 405

    if module:
        _check_called_foris_controller_module(current_app.backend._instance, module)


@pytest.mark.parametrize(
    'endpoint, module', [
        ('wifi-reset', 'wifi'),
        ('connection-test', 'wan'),
        ('dns/test', 'wan'),
        ('ntp-update', 'time'),
        ('reboot', 'maintain'),
    ]
)
def test_api_post_endpoints_exist(client, endpoint, module):
    url = f'/api/{endpoint}'
    response = client.post(url)

    assert response.status_code == 200
    _check_called_foris_controller_module(current_app.backend._instance, module)


def _check_called_foris_controller_module(sender_mock, module):
    modules = [call[1][0] for call in sender_mock.send.mock_calls]
    assert module in modules
