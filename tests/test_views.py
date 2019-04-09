#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

import pytest


@pytest.mark.parametrize(
    'module', [
        'notifications',
        'wifi',
        'wan',
        'lan',
    ]
)
def test_view_exist(client, module):
    url = f'/{module}'
    response = client.get(url)
    assert response.status_code == 200
    assert str.encode(module) in response.data
    assert str.encode('_container') in response.data

    response = client.post(url)
    assert response.status_code == 405
