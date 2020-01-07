#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.


def get_mocked_send(mocked_data=None):
    mocked_data = mocked_data or {}

    def mocked_send(module, action, data=None, timeout=None, controller_id=None):
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
            **mocked_data
        }
        return response_data.get(module, {}).get(action, {})

    return mocked_send
