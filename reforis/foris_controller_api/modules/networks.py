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
    res = ''
    if request.method == 'GET':
        settings = current_app.backend.perform(module, 'get_settings')
        del settings['device']
        res = settings
    elif request.method == 'POST':
        data = request.json
        res = current_app.backend.perform(module, 'update_settings', data)
    return jsonify(res)


views = [{
    'rule': '/interfaces',
    'view_func': interfaces,
    'methods': ['GET', 'POST']
}]
