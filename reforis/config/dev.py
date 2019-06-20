#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

# pylint: disable=wildcard-import,unused-wildcard-import

from reforis.config.prod import *

DEBUG = False

STATIC_DIR = '../reforis_static/'

SECRET_KEY = 'dev_secret_key'

SESSION_PERMANENT = True

# WebSockets
WS_PORT = 9081

BUSES_CONF['mqtt']['port'] = 11883
