#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

# pylint: disable=wildcard-import,unused-wildcard-import

from reforis.config.dev import *

TESTING = True
BUSES_CONF['mqtt']['credentials_file'] = None
