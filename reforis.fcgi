#!/usr/bin/python

#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.
#

from flup.server.fcgi import WSGIServer
from reforis import create_app

if __name__ == '__main__':
    app = create_app()
    WSGIServer(app).run()
