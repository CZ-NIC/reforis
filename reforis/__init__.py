#  Copyright (C) 2018 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.


from flask import Flask


# TODO: Put bus to config may be a better option.
def create_app(config=None, bus='ubus'):
    app = Flask(__name__)
    app.config.from_object(config)

    from flask_bootstrap import Bootstrap
    Bootstrap(app)

    from .views import base
    from .api import api
    app.register_blueprint(base)
    app.register_blueprint(api)

    load_plugins(app)

    from .backend import Backend
    app.backend = Backend(bus, '/var/run/ubus.sock')

    return app


def load_plugins(app):
    from reforis.plugins import get_plugins

    plugins = get_plugins()
    for plugin in plugins:
        app.register_blueprint(plugin)

    @app.context_processor
    def make_shell_context():
        return {'plugins': plugins}
