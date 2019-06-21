#
# reforis
# Copyright (C) 2019 CZ.NIC, z.s.p.o. (http://www.nic.cz/)
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software Foundation,
# Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301  USA
#

import os


def main():
    class AppWrapper:
        def __init__(self, app):
            self.app = app

        def __call__(self, environ, start_response):
            environ["SCRIPT_NAME"] = "/reforis"
            return self.app(environ, start_response)

    from flup.server.fcgi import WSGIServer
    from reforis import create_app

    app = AppWrapper(create_app("prod"))
    WSGIServer(
        app,
        debug=True,
        bindAddress=os.environ.get("FCGI_SOCKET", "/tmp/fastcgi.reforis-config.socket")
    ).run()


if __name__ == "__main__":
    main()
