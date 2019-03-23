#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

import json

from flask import Blueprint, current_app, request, jsonify

from reforis import _get_locale_from_backend
from reforis.backend import ExceptionInBackend

api = Blueprint(
    'api',
    __name__,
    template_folder='templates',
    static_folder='static',
    url_prefix='/api'
)


# TODO: make some wrapper to catch backend exceptions...

@api.route("/notifications", methods=['GET', 'POST'])
def notifications():
    backend_data = current_app.backend.perform("router_notifications", "list",
                                               {'lang': _get_locale_from_backend(current_app)})
    if request.method == 'POST':
        data = request.json
        res = ""
        try:
            print(data)
            res = current_app.backend.perform("router_notifications", "mark_as_displayed", data)
            print(res)
        except ExceptionInBackend as e:
            # TODO: logging...
            error = "Remote Exception: %s" % e.remote_description
            extra = "%s" % json.dumps(e.query)
            trace = e.remote_stacktrace
            print("\nError: {}\nExtra: {}\nTrace: {}".format(error, extra, trace))
        return jsonify(res)
    return jsonify(backend_data)


@api.route("/wifi", methods=['GET', 'POST'])
def wifi():
    backend_data = current_app.backend.perform("wifi", "get_settings")
    if request.method == 'POST':
        data = request.json
        res = ""
        try:
            res = current_app.backend.perform("wifi", "update_settings", data)
        except ExceptionInBackend as e:
            # TODO: logging...
            error = "Remote Exception: %s" % e.remote_description
            extra = "%s" % json.dumps(e.query)
            trace = e.remote_stacktrace
            print("\nError: {}\nExtra: {}\nTrace: {}".format(error, extra, trace))
        return jsonify(res)
    return jsonify(backend_data)
