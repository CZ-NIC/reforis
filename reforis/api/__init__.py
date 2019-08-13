#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

"""
The API is used for React reForis client application, which communicates with the Flask server via AJAX calls.

The design of the API is imposed by ``foris-controller``, and communication tasks between client-side application and
backend. In this case, the APIBlueprint serves as a layer between the foris-controller and a client application. It
passes required endpoints (sometimes with some adjustments) from Foris controller to the client application.

Mostly of the ``foris-controller`` endpoints which represent network, router system operations and Foris application
configurations has two actions: ``get_settings`` and ``set_settings``. These endpoints are ”translated” to particular
HTTP endpoint with ``GET`` and ``POST`` methods by appropriate actions.
"""

from flask import Blueprint, jsonify, make_response

# pylint: disable=invalid-name
from reforis.config.routes import ROUTES

api = Blueprint('reForisAPI', __name__, url_prefix='/api')


@api.route('/navigation', methods=['GET'])
def navigation():
    return jsonify(ROUTES)


@api.route('/health-check', methods=['GET'])
def health_check():
    """Check if server is run."""
    response = make_response(jsonify(True))
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'GET, OPTIONS')
    response.headers.add('Access-Control-Allow-Headers', 'Origin, Accept, Content-Type, X-Requested-With')
    return response
