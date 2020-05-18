#  Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

from flask import jsonify, current_app


def reboot():
    """
        Trigger device reboot.
        See ``reboot``  action in the `foris-controller maintain module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/foris-controller/blob/master/foris_controller_modules/maintain/schema/maintain.json>`_.
    """
    return jsonify(current_app.backend.perform('maintain', 'reboot'))


# pylint: disable=invalid-name
views = [{
    'rule': '/reboot',
    'view_func': reboot,
    'methods': ['POST']
}]
