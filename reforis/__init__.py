#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.
from reforis.auth import register_login_required
from .locale import TranslationsHelper


def create_app(config='config.py'):
    from flask import Flask
    app = Flask(__name__)
    app.config.from_pyfile(config)

    from flask_babel import Babel
    babel = Babel(app)

    from .backend import Backend
    app.backend = Backend(app.config['FORIS_BUS'], '/var/run/ubus.sock')

    @babel.localeselector
    def select_locale():
        # TODO: catch exception here
        backend_data = app.backend.perform("web", "get_data")
        return backend_data['language']

    @app.context_processor
    def add_translations_catalog_to_ctx():
        # TODO: catch exception here
        backend_data = app.backend.perform("web", "get_data")

        translations = TranslationsHelper.load(
            # There is only one directory with translations in Foris so it's OK.
            next(babel.translation_directories),
            [backend_data['language']],
            babel.domain
        )
        return {'babel_catalog': translations.json_catalog}

    register_login_required(app)

    from .views import base
    from .api import api
    app.register_blueprint(base)
    app.register_blueprint(api)

    load_plugins(app)

    return app


def load_plugins(app):
    from .plugins import get_plugins

    plugins = get_plugins()
    for plugin in plugins:
        app.register_blueprint(plugin)

    @app.context_processor
    def make_shell_context():
        return {'plugins': plugins}
