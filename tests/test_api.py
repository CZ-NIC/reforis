#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.


def test_health_check_is_not_protected(client):
    client.get('/logout')  # Make sure user is logged out.
    response = client.get('api/health-check')
    assert response.status_code == 200
