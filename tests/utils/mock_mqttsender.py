#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.


class MockMqttSender:
    send = True


def send_mock(module, action, data, timeout=None, controller_id=None):
    RESPONSE_DATA = {
        'web': {
            'get_data': {
                'language': 'en',
                'password_ready': True,
                'guide': {'enabled': False}
            },
            'list_languages': {
                'languages': ['en', 'cs'],
            }
        },
        'updater': {
            'get_settings': {
                'enabled': True,
                'user_lists': [],
                'languages': [],
                'approval': {},
                'approval_settings': {}
            }
        },
        'router_notifications': {
            'get_settings': {
                'reboots': {}
            },
        },
        'networks': {
            'get_settings': {
                'device': {}
            }
        }
    }
    return RESPONSE_DATA.get(module, {}).get(action, {})
