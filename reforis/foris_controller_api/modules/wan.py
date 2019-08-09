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
    res = ''
    if request.method == 'GET':
        res = {
            **current_app.backend.perform('wan', 'get_settings'),
            **current_app.backend.perform('wan', 'get_wan_status')
        }
    elif request.method == 'POST':
        data = request.json
        res = current_app.backend.perform('wan', 'update_settings', data)
    return jsonify(res)


def connection_test():
    """
        Trigger WAN connection test . The results of the test is obtained via WebSockets.
        See ``connection_test_trigger``  action in the `foris-controller wan module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/blob/master/foris_controller_modules/wan/schema/wan.json>`_.
    """
    return jsonify(current_app.backend.perform('wan', 'connection_test_trigger', data={'test_kinds': ['ipv4', 'ipv6']}))


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
