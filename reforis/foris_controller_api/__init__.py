"""
The API is used for React reForis client application, which communicates with the Flask server via AJAX calls.

The design of the API is imposed by ``foris-controller``, and communication tasks between client-side application and
backend. In this case, the APIBlueprint serves as a layer between the foris-controller and a client application. It
passes required endpoints (sometimes with some adjustments) from Foris controller to the client application.

Mostly of the ``foris-controller`` endpoints which represent network, router system operations and Foris application
configurations has two actions: ``get_settings`` and ``set_settings``. These endpoints are ”translated” to particular
HTTP endpoint with ``GET`` and ``POST`` methods by appropriate actions.
"""

from importlib import import_module

from flask import Blueprint, jsonify

FORIS_CONTROLLER_MODULES = [
    'about',
    'dns',
    'guest',
    'lan',
    'maintain',
    'networks',
    'password',
    'router_notifications',
    'time',
    'updater',
    'wan',
    'web',
    'wifi'
]

# pylint: disable=invalid-name
foris_controller_api = Blueprint('ForisControllerAPI', __name__, url_prefix='/api')


class InvalidRequest(Exception):
    """
    Raised when invalid request was received.
    """
    status_code = 400

    def __init__(self, error, status_code=None, payload=None):
        Exception.__init__(self)
        self.error = error
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        # pylint: disable=invalid-name
        rv = dict(self.payload or ())
        rv['error'] = self.error
        return rv


@foris_controller_api.errorhandler(InvalidRequest)
def handle_invalid_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response


def register_modules(modules):
    for module in modules:
        module = import_module(f'.{module}', package='reforis.foris_controller_api.modules')
        register_views(module.views)


def register_views(views):
    for view in views:
        foris_controller_api.add_url_rule(**view)


register_modules(FORIS_CONTROLLER_MODULES)
