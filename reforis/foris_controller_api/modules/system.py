from flask import jsonify, current_app, request


def hostname():
    """
    .. http:get:: /api/system/hostname
        Get Hostname of router.
        See ``get_hostname`` action in the `foris-controller system module JSON schema
        <https://gitlab.nic.cz/turris/foris-controller/foris-controller/blob/master/foris_controller_modules/system/schema/system.json>`_.

    .. http:post:: /api/system/hostname
        Set Hostname of router.
        See ``set_hostname`` action in the `foris-controller system module JSON schema
        <https://gitlab.nic.cz/turris/foris-controller/foris-controller/blob/master/foris_controller_modules/system/schema/system.json>`_.
    """
    data = request.json

    if request.method == 'GET':
        response = current_app.backend.perform('system', 'get_hostname')
    elif request.method == 'POST':
        response = current_app.backend.perform('system', 'set_hostname', data)
    return jsonify(response)


# pylint: disable=invalid-name
views = [
    {
        'rule': '/system/hostname',
        'view_func': hostname,
        'methods': ['GET', 'POST'],
    },
]
