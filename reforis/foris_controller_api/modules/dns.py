from flask import current_app, jsonify, request

from reforis.foris_controller_api.utils import _foris_controller_settings_call


def dns():
    """
    .. http:get:: /api/dns
        Get `guest network` router settings.
        See ``get_settings`` action in the `foris-controller dns module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/blob/master/foris_controller_modules/dns/schema/dns.json>`_.

    .. http:post:: /api/dns
        Get `dns network` router settings.
        See ``update_settings`` action in the `foris-controller dns module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/blob/master/foris_controller_modules/dns/schema/dns.json>`_.
    """
    return _foris_controller_settings_call('dns')


def dns_test():
    """
        Trigger DNS connection test . The results of the test is obtained via WebSockets.
        See ``connection_test_trigger`` action in the `foris-controller wan module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/blob/master/foris_controller_modules/wan/schema/wan.json>`_.
    """
    request_data = {'test_kinds': ['dns']}
    response = current_app.backend.perform('wan', 'connection_test_trigger', request_data)
    return jsonify(response)


def forwarders():
    response = current_app.backend.perform('dns', 'list_forwarders')
    return jsonify(response)


def add_forwarder():
    data = request.json
    response = current_app.backend.perform('dns', 'add_forwarder', data)
    return jsonify(response)


def set_forwarder(forwarder_name):
    data = request.json
    response = current_app.backend.perform('dns', 'set_forwarder', {'name': forwarder_name, **data})
    return jsonify(response)


def delete_forwarder(forwarder_name):
    response = current_app.backend.perform('dns', 'del_forwarder', {'name': forwarder_name})
    return jsonify(response)


# pylint: disable=invalid-name
views = [
    {
        'rule': '/dns',
        'view_func': dns,
        'methods': ['GET', 'POST'],
    }, {
        'rule': '/dns/test',
        'view_func': dns_test,
        'methods': ['POST']
    }, {
        'rule': '/dns/forwarders',
        'view_func': forwarders,
        'methods': ['GET']
    }, {
        'rule': '/dns/forwarder',
        'view_func': add_forwarder,
        'methods': ['POST']
    }, {
        'rule': '/dns/forwarder/<forwarder_name>',
        'view_func': set_forwarder,
        'methods': ['PATCH']
    }, {
        'rule': '/dns/forwarder/<forwarder_name>',
        'view_func': delete_forwarder,
        'methods': ['DELETE']
    }
]
