#  Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

from flask import jsonify, current_app


def customization():
    """
    .. http:get:: /api/system/customization
        Get router customization.
        Currently it is only Turris Shield or no customization at all.
        See ``get_customization`` action in the `foris-controller system module JSON schema
        <https://gitlab.nic.cz/turris/foris-controller/foris-controller/blob/master/foris_controller_modules/system/schema/system.json>`_.
    """
    return jsonify(current_app.backend.perform('system', 'get_customization'))


# pylint: disable=invalid-name
views = [
    {
        'rule': '/system/customization',
        'view_func': customization,
        'methods': ['GET'],
    },
]
