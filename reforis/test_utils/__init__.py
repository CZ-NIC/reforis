#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.


from contextlib import contextmanager
from unittest import mock

from reforis.test_utils.mocked_send import get_mocked_send


@contextmanager
def mock_backend_response(data):
    with mock.patch('flask.current_app.backend.perform') as perform_mock:
        perform_mock.side_effect = get_mocked_send(data)
        yield perform_mock
