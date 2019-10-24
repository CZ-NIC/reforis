import pytest
from flask import Flask, jsonify
from flask_babel import Babel

from reforis.foris_controller_api.utils import APIError


@pytest.fixture(scope='module')
def app_with_blueprint():
    def error_handler(error):
        return jsonify(error.data), error.status_code

    def app_factory(blueprint):
        app = Flask(__name__)
        app.register_blueprint(blueprint)
        app.register_error_handler(APIError, error_handler)
        app.backend = None
        Babel(app)
        return app

    return app_factory
