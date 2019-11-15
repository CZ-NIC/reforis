from flask import request, current_app, jsonify


def lan():
    """
    .. http:get:: /api/lan
        Get LAN router settings.
        See ``get_settings`` action in the `foris-controller lan module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/foris-controller/blob/master/foris_controller_modules/lan/schema/lan.json>`_.

    .. http:post:: /api/lan
        Get LAN router settings.
        See ``update_settings`` action in the `foris-controller lan module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/foris-controller/blob/master/foris_controller_modules/lan/schema/lan.json>`_.
    """
    response = None
    if request.method == 'GET':
        response = current_app.backend.perform('lan', 'get_settings')
        if response['mode'] == 'managed' and response['mode_managed']['dhcp']['enabled']:  # Router mode
            # Convert seconds to hours
            response['mode_managed']['dhcp']['lease_time'] /= 3600
    elif request.method == 'POST':
        data = request.json
        if data['mode'] == 'managed' and data['mode_managed']['dhcp']['enabled']:  # Router mode
            # Convert hours to seconds
            data['mode_managed']['dhcp']['lease_time'] *= 3600
        response = current_app.backend.perform('lan', 'update_settings', data)
    return jsonify(response)


# pylint: disable=invalid-name
views = [{
    'rule': '/lan',
    'view_func': lan,
    'methods': ['GET', 'POST']
}]
