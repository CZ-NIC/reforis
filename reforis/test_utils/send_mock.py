#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.


def send_mock(module, action, data, timeout=None, controller_id=None):
    response_data = {
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
                'approval_settings': {
                    'status': 'on'
                }
            },
            'run': {
                'result': True
            }
        },
        'router_notifications': {
            'get_settings': {
                'reboots': {}
            },
            'list': {
                'notifications': []
            }
        },
        'networks': {
            'get_settings': {
                'device': {}
            }
        },
        'about': {
            'get': {
                'serial': '123abcdef'
            }
        },
        'lan': {
            'get_settings': {
                'mode': 'unmanaged'
            },
            'update_settings': {
                'mode': 'unmanaged'
            }
        },
        'dns': {
            'add_forwarder': {
                'result': True
            },
            'set_forwarder': {
                'result': True
            },
            'del_forwarder': {
                'result': True
            }
        }
    }
    return response_data.get(module, {}).get(action, {})
