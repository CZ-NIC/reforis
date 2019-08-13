from flask import request, current_app, jsonify


def interfaces():
    """
    .. http:get:: /api/interfaces
        Get `network interfaces` router settings.
        See ``get_settings`` action in the `foris-controller networks module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/blob/master/foris_controller_modules/networks/schema/networks.json>`_.

    .. http:post:: /api/interfaces
        Get `network interfaces` router settings.
        See ``update_settings`` action in the `foris-controller networks module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/blob/master/foris_controller_modules/networks/schema/networks.json>`_.
    """
    module = 'networks'
    response = None
    if request.method == 'GET':
        settings = current_app.backend.perform(module, 'get_settings')
        del settings['device']
        response = settings
    elif request.method == 'POST':
        data = request.json
        response = current_app.backend.perform(module, 'update_settings', data)
    return jsonify(response)


# pylint: disable=invalid-name
views = [{
    'rule': '/interfaces',
    'view_func': interfaces,
    'methods': ['GET', 'POST']
}]
