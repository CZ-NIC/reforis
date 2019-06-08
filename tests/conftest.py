#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

import pytest

from unittest import mock

import reforis
from tests.utils.mock_mqttsender import MockMqttSender
from tests.utils.surrogate import surrogate


@pytest.fixture
def client():
    """
    Flask's client to make requests. For example:

    .. code-block:: python

        def test_foo(client):
            res = client.get('/api/foo')
            assert res.status_code == 200
            assert res.json == {...}
    """
    app = _stubbed_app()
    with app.test_client() as client:
        with client.session_transaction() as session:
            session['logged'] = True
        yield client


@pytest.fixture
def request_ctx():
    """
    Use this fixture when you call functions directly but they need request
    context like access to logged user, language and so on.
    """
    app = _stubbed_app()

    with app.test_request_context('/'):
        app.preprocess_request()
        yield


@surrogate('foris_client.buses.mqtt.MqttSender')
@surrogate('foris_client.buses.base.ControllerError')
@mock.patch('foris_client.buses.mqtt.MqttSender', MockMqttSender)
@mock.patch('reforis.backend.MQTTBackend._parse_credentials', mock.Mock)
def _stubbed_app():
    # The foris client may not existed on the testing environment
    # so we surrogate this module to avoid ImportError during testing.
    return reforis.create_app('test')
