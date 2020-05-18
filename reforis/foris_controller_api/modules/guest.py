from flask import current_app, jsonify, request

from ..utils import process_dhcp_response


def guest_network_get():
    """
    .. http:get:: /api/guest-network
        Get `guest network` router settings.
        See ``get_settings`` action in the `foris-controller guest module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/foris-controller/blob/master/foris_controller_modules/guest/schema/guest.json>`_.
    """
    response = current_app.backend.perform('guest', 'get_settings')
    if response['dhcp']['enabled'] is True:
        # Convert seconds to hours
        response['dhcp'] = process_dhcp_response(response['dhcp'], response['ip'], response['netmask'])
    return jsonify(response)


def guest_network_set():
    """
    .. http:post:: /api/guest-network
        Set `guest network` router settings.
        See ``update_settings`` action in the `foris-controller guest module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/foris-controller/blob/master/foris_controller_modules/guest/schema/guest.json>`_.
    """
    data = request.json
    if data.get('dhcp', False) and data['dhcp']['enabled'] is True:
        # Convert hours to seconds
        data['dhcp']['lease_time'] *= 3600
    response = current_app.backend.perform('guest', 'update_settings', data)
    return jsonify(response)


# pylint: disable=invalid-name
views = [{
    'rule': '/guest-network',
    'view_func': guest_network_get,
    'methods': ['GET']
}, {
    'rule': '/guest-network',
    'view_func': guest_network_set,
    'methods': ['POST']
}]
