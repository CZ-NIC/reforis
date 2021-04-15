#  Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

from flask import request, current_app, jsonify
from flask_babel import _

from .utils import process_dhcp_get, process_dhcp_post, response_to_json_or_error


def lan_get():
    """
    .. http:get:: /api/lan
        Get LAN router settings.
        See ``get_settings`` action in the `foris-controller lan module JSON schema
        <https://gitlab.nic.cz/turris/foris-controller/foris-controller/blob/master/foris_controller_modules/lan/schema/lan.json>`_.
    """
    response = current_app.backend.perform('lan', 'get_settings')
    if response['mode'] == 'managed' and response['mode_managed']['dhcp']['enabled']:  # Router mode
        response['mode_managed']['dhcp'] = process_dhcp_get(
            response['mode_managed']['dhcp'],
            response['mode_managed']['router_ip'],
            response['mode_managed']['netmask'],
        )

    return jsonify(response)


def lan_post():
    """
    .. http:post:: /api/lan
        Get LAN router settings.
        See ``update_settings`` action in the `foris-controller lan module JSON schema
        <https://gitlab.nic.cz/turris/foris-controller/foris-controller/blob/master/foris_controller_modules/lan/schema/lan.json>`_.
    """
    data = request.json
    if data['mode'] == 'managed' and data['mode_managed']['dhcp']['enabled']:  # Router mode
        data['mode_managed']['dhcp'] = process_dhcp_post(
            data['mode_managed']['dhcp'],
            data['mode_managed']['router_ip'],
            data['mode_managed']['netmask'],
        )
    response = current_app.backend.perform('lan', 'update_settings', data)
    return jsonify(response)


def lan_set_client():
    """
    .. http:post:: /api/lan/set_client
        Set LAN DHCP leases manually.
        See ``set_dhcp_client`` action in the `foris-controller lan module JSON schema
        <https://gitlab.nic.cz/turris/foris-controller/foris-controller/blob/master/foris_controller_modules/lan/schema/lan.json>`_.
    """
    data = request.json
    response = current_app.backend.perform('lan', 'set_dhcp_client', data)
    return response_to_json_or_error(response, _('Can\'t create DHCP lease.'))


# pylint: disable=invalid-name
views = [{
    'rule': '/lan',
    'view_func': lan_get,
    'methods': ['GET']
}, {
    'rule': '/lan',
    'view_func': lan_post,
    'methods': ['POST']
}, {
    'rule': '/lan/set_client',
    'view_func': lan_set_client,
    'methods': ['POST']
}]
