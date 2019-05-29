#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

import pytest


@pytest.mark.parametrize(
    'endpoint, post_is_allowed', [
        ('notifications', True),
        ('notifications-settings', True),
        ('wan', True),
        ('lan', True),
        ('wifi', True),
        ('dns', True),
        ('guest-network', True),
        ('connection-test', False),
        ('dns-test', False),
        ('region-and-time', True),
        ('reboot', False),
    ]
)
def test_api_endpoints_exist(client, endpoint, post_is_allowed):
    url = f'/api/{endpoint}'
    response = client.get(url)
    assert response.status_code == 200

    response = client.post(url)
    if post_is_allowed:
        assert response.status_code == 200
    else:
        assert response.status_code == 405
