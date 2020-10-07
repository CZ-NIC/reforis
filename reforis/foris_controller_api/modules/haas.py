from flask import jsonify, current_app, request


def haas():
    """
    .. http:get:: /api/haas
        See ``get_settings`` action in the `foris-controller haas module JSON schema
        <https://gitlab.nic.cz/turris/foris-controller/foris-controller-haas-module/-/blob/master/foris_controller_modules/haas/schema/haas.json>`_.

    .. http:post:: /api/haas
        See ``update_settings`` action in the `foris-controller haas module JSON schema
        <https://gitlab.nic.cz/turris/foris-controller/foris-controller-haas-module/-/blob/master/foris_controller_modules/haas/schema/haas.json>`_.
    """
    data = request.json

    if request.method == 'GET':
        response = current_app.backend.perform('haas', 'get_settings')
    elif request.method == 'POST':
        response = current_app.backend.perform('haas', 'update_settings', data)

    return jsonify(response)


# pylint: disable=invalid-name
views = [
    {
        'rule': '/haas',
        'view_func': haas,
        'methods': ['GET', 'POST'],
    },
]
