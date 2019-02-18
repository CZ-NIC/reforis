#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

import pkg_resources


def get_plugins():
    return [entry_point.load() for entry_point in pkg_resources.iter_entry_points('foris.plugins')]
