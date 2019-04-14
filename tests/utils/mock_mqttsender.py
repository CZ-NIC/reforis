#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.
from unittest.mock import Mock

RESPONSE_DATA = {
    'web': {
        'get_data': {
            'language': 'en'
        }
    },

}


class MockMqttSender(Mock):
    def send(self, module, action, data, timeout=None, controller_id=None):
        return RESPONSE_DATA.get(module, {}).get(action, {})
