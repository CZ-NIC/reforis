"""
The API is used for React reForis client application, which communicates with the Flask server via AJAX calls.

The design of the API is imposed by ``foris-controller``, and communication tasks between client-side application and
backend. In this case, the APIBlueprint serves as a layer between the foris-controller and a client application. It
passes required endpoints (sometimes with some adjustments) from Foris controller to the client application.

Mostly of the ``foris-controller`` endpoints which represent network, router system operations and Foris application
configurations has two actions: ``get_settings`` and ``set_settings``. These endpoints are ”translated” to particular
HTTP endpoint with ``GET`` and ``POST`` methods by appropriate actions.
"""

from http import HTTPStatus
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


class APIError(Exception):
    """
    Raised when invalid request was received.
    """

    def __init__(self, data, status_code=HTTPStatus.BAD_REQUEST):
        super().__init__(self)
        self.data = data
        self.status_code = status_code


@foris_controller_api.errorhandler(APIError)
def handle_invalid_usage(error):
    return jsonify(error.data), error.status_code


def register_modules(modules):
    for module in modules:
        module = import_module(f'.{module}', package='reforis.foris_controller_api.modules')
        register_views(module.views)


def register_views(views):
    for view in views:
        foris_controller_api.add_url_rule(**view)


register_modules(FORIS_CONTROLLER_MODULES)
