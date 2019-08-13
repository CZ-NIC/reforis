from flask import request, current_app, jsonify


def wan():
    """
    .. http:get:: /api/wan
        Get WAN router settings.
        See ``get_settings`` action in the `foris-controller wan module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/blob/master/foris_controller_modules/wan/schema/wan.json>`_.

    .. http:post:: /api/wan
        Get WAN router settings.
        See ``update_settings`` action in the `foris-controller wan module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/blob/master/foris_controller_modules/wan/schema/wan.json>`_.
    """
    response = None
    if request.method == 'GET':
        response = {
            **current_app.backend.perform('wan', 'get_settings'),
            **current_app.backend.perform('wan', 'get_wan_status')
        }
    elif request.method == 'POST':
        data = request.json
        response = current_app.backend.perform('wan', 'update_settings', data)
    return jsonify(response)


def connection_test():
    """
        Trigger WAN connection test . The results of the test is obtained via WebSockets.
        See ``connection_test_trigger``  action in the `foris-controller wan module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/blob/master/foris_controller_modules/wan/schema/wan.json>`_.
    """
    request_data = {'test_kinds': ['ipv4', 'ipv6']}
    res = current_app.backend.perform('wan', 'connection_test_trigger', request_data)
    return jsonify(res)


# pylint: disable=invalid-name
views = [
    {
        'rule': '/wan',
        'view_func': wan,
        'methods': ['GET', 'POST']
    }, {
        'rule': '/connection-test',
        'view_func': connection_test,
        'methods': ['POST']
    }
]
