#  Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

from unittest import mock
from http import HTTPStatus


def test_timeout(client):
    with mock.patch('flask.current_app.backend._send') as perform_mock:
        perform_mock.side_effect = TimeoutError
        response = client.get('/about')
    assert response.status_code == HTTPStatus.INTERNAL_SERVER_ERROR
    assert response.json == 'Timeout occurred during performing foris controller action.'
