import pytest
from flask import Flask
from flask_babel import Babel


@pytest.fixture(scope='module')
def app_with_blueprint():
    def app_factory(blueprint):
        app = Flask(__name__)
        app.register_blueprint(blueprint)
        app.backend = None
        Babel(app)
        return app
    return app_factory
