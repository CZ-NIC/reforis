from flask import request, current_app, jsonify


def _foris_controller_settings_call(module):
    """
    "Translate" typical ``foris-controller`` module to HTTP endpoint with ``GET`` and ``POST`` methods.

    **It works only inside the request context!**
    """
    res = ''
    if request.method == 'GET':
        res = current_app.backend.perform(module, 'get_settings')
    elif request.method == 'POST':
        data = request.json
        res = current_app.backend.perform(module, 'update_settings', data)
    return jsonify(res)
