#  Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

import ipaddress
from http import HTTPStatus

from flask import request, current_app, jsonify

from reforis.utils import APIError


def process_dhcp_get(dhcp, ip, netmask):
    network = ipaddress.IPv4Network(f'{ip}/{netmask}', strict=False)
    start = network.network_address + dhcp['start']
    limit = start + dhcp['limit']
    return {
        **dhcp,
        # Convert seconds to hours
        'lease_time': dhcp['lease_time'] / 3600,
        'start': str(start),
        'limit': str(limit),
    }


def process_dhcp_post(dhcp, ip, netmask):
    network = ipaddress.IPv4Network(f'{ip}/{netmask}', strict=False)
    start = int(ipaddress.IPv4Address(dhcp['start'])) - int(network.network_address)
    limit = int(ipaddress.IPv4Address(dhcp['limit'])) - int(ipaddress.IPv4Address(dhcp['start']))
    return {
        **dhcp,
        # Convert hours to seconds
        'lease_time': dhcp['lease_time'] * 3600,
        'start': start,
        'limit': limit,
    }


def _foris_controller_settings_call(module):
    """
    "Translate" typical ``foris-controller`` module to HTTP endpoint with ``GET`` and ``POST`` methods.

    **It works only inside the request context!**
    """
    response = None
    if request.method == 'GET':
        response = current_app.backend.perform(module, 'get_settings')
    elif request.method == 'POST':
        data = request.json
        response = current_app.backend.perform(module, 'update_settings', data)
    return jsonify(response)


def validate_json(json_data, expected_fields=None):
    """
    Raise APIError when json_data is not valid.
    """
    if not json_data:
        raise APIError('Invalid JSON', HTTPStatus.BAD_REQUEST)

    if not expected_fields:
        return

    errors = {}
    for field_name, field_type in expected_fields.items():
        field = json_data.get(field_name)
        if field is None:
            errors[field_name] = 'Missing data for required field.'
        elif not isinstance(field, field_type):
            errors[field_name] = f'Expected data of type: {field_type.__name__}'
    if errors:
        raise APIError(errors, HTTPStatus.BAD_REQUEST)
