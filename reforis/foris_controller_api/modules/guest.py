from flask import current_app, jsonify, request


def guest_network():
    """
    .. http:get:: /api/guest-network
        Get `guest network` router settings.
        See ``get_settings`` action in the `foris-controller guest module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/foris-controller/blob/master/foris_controller_modules/guest/schema/guest.json>`_.

    .. http:post:: /api/guest-network
        Get `guest network` router settings.
        See ``update_settings`` action in the `foris-controller guest module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/foris-controller/blob/master/foris_controller_modules/guest/schema/guest.json>`_.
    """
    response = None
    if request.method == 'GET':
        response = current_app.backend.perform('guest', 'get_settings')
        if response['dhcp']['enabled'] is True:
            # Convert seconds to hours
            response['dhcp']['lease_time'] /= 3600
    elif request.method == 'POST':
        data = request.json
        if data['dhcp']['enabled'] is True:
            # Convert hours to seconds
            data['dhcp']['lease_time'] *= 3600
        response = current_app.backend.perform('guest', 'update_settings', data)
    return jsonify(response)


# pylint: disable=invalid-name
views = [{
    'rule': '/guest-network',
    'view_func': guest_network,
    'methods': ['GET', 'POST']
}]
