from flask import current_app, jsonify

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
    return jsonify(current_app.backend.perform('wan', 'connection_test_trigger', data={'test_kinds': ['dns']}))


# pylint: disable=invalid-name
views = [
    {
        'rule': '/dns',
        'view_func': dns,
        'methods': ['GET', 'POST'],
    }, {
        'rule': '/dns-test',
        'view_func': dns_test,
        'methods': ['POST']
    }
]
