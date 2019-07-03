#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.
from unittest import mock

import pytest
from flask import current_app


@pytest.mark.parametrize(
    'endpoint, module, post_is_allowed', [
        ('wan', 'wan', True),
        ('lan', 'lan', True),
        ('wifi', 'wifi', True),
        ('wifi-reset', 'wifi', False),
        ('dns', 'dns', True),
        ('guest-network', 'guest', True),
        ('connection-test', 'wan', False),
        ('dns-test', 'wan', False),
        ('interfaces', 'networks', True),

        ('notifications', 'router_notifications', True),
        ('notifications-settings', 'router_notifications', True),
        ('region-and-time', 'time', True),
        ('ntp-update', 'time', False),

        ('language', 'web', True),
        ('languages', 'web', False),
        ('updates', 'updater', True),
        ('packages', 'updater', True),
        ('approvals', 'updater', True),

        ('reboot', None, False),
        ('health-check', None, False),

        ('guide', 'web', False),
    ]
)
def test_api_endpoints_exist(client, endpoint, module, post_is_allowed):
    url = f'/api/{endpoint}'
    response = client.get(url)
    assert response.status_code == 200
    fake_json = {'reboots': {}, 'enabled':{}}
    response = client.post(url, json=fake_json)

    if post_is_allowed:
        assert response.status_code == 200
    else:
        assert response.status_code == 405

    if module:
        _check_called_foris_controller_module(current_app.backend._instance, module)


def _check_called_foris_controller_module(sender_mock, module):
    modules = [call[1][0] for call in sender_mock.send.mock_calls]
    assert module in modules
