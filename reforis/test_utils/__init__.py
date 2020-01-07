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


def _test_api_endpoint_foris_controller_call(
        client,
        url, method,
        module, action,
        request_data=None,
        response_data=None
):
    """
    response_data is returned by backend call with `module` and `action` specified in arguments. If another backend
    module and action have to be mocked then `module` and `action` it can be specified directly:

    _test_api_endpoint_foris_controller_call(
        client,
        f'api/updates/', 'get',
        'updater', 'get_settings',
        response_data={
            'updater': {'get_settings': {'approval': True, 'user_lists': [], 'languages': []}},
            'router_notifications': {'get_settings': {'reboots': {}}}
        }
    )
    """

    response_mock_data = {}
    if response_data is not None:
        response_mock_data.update({module: {action: response_data}})

    # We want to add dict value again because we don't know if module and action specified inside of dict or not.
    if type(response_data) is dict:
        response_mock_data.update(response_data)

    with mock_backend_response(response_mock_data) as mock_send:
        response = getattr(client, method)(url, json=request_data)

    assert response.status_code == 200
    _check_called_foris_controller_module(mock_send, module, action)


def _check_called_foris_controller_module(sender_mock, module, action):
    calls = [(call[1][0], call[1][1]) for call in sender_mock.mock_calls]
    assert (module, action) in calls
