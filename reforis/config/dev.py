#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

# pylint: disable=wildcard-import,unused-wildcard-import

from reforis.config.prod import *

DEBUG = False

SECRET_KEY = 'dev_secret_key'


# WebSockets
WS_PORT = 9081
