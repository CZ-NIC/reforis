#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

# pylint: disable=unused-variable,unused-argument

import json

import pkg_resources
from flask import render_template

from .locale import TranslationsHelper


def create_app(config):
    from flask import Flask
    app = Flask(__name__)
    app.config.from_pyfile(f'config/{config}.py')

    app.static_folder = app.config.get('STATIC_DIR')

    from flask_session import Session
    Session(app)

    set_backend(app)
    set_locale(app)

    from .views import views
    from .api import api
    from .guide import guide

    app.register_blueprint(views)
    app.register_blueprint(api)
    app.register_blueprint(guide)

    from .auth import register_login_required
    register_login_required(app)

    load_plugins(app)

    app.register_error_handler(404, not_found_error)
    app.register_error_handler(500, internal_error)
    from reforis.backend import ExceptionInBackend
    app.register_error_handler(ExceptionInBackend, foris_controller_error)

    @app.context_processor
    def add_version_to_ctx():
        try:
            version = pkg_resources.get_distribution("reforis").version
        except pkg_resources.DistributionNotFound:
            version = None
        return {'version': version}

    return app


def not_found_error(error):
    return render_template('errors/404.html'), 404


def internal_error(error):
    return render_template('errors/500.html', error=error), 500


def foris_controller_error(e):
    error = {
        'error': 'Remote Exception: %s' % e.remote_description,
        'extra': '%s' % json.dumps(e.query),
        'trace': e.remote_stacktrace,
    }
    return render_template('errors/500.html', **error), 500


def set_backend(app):
    bus = app.config['BUS']
    bus_config = app.config['BUSES_CONF'][bus]

    if bus == 'mqtt':
        from reforis.backend import MQTTBackend
        app.backend = MQTTBackend(**bus_config)
    if bus == 'ubus':
        from reforis.backend import UBusBackend
        app.backend = UBusBackend(**bus_config)


def set_locale(app):
    from flask_babel import Babel
    babel = Babel(app)

    @babel.localeselector
    def get_locale():
        return _get_locale_from_backend(app)

    @app.context_processor
    def add_translations_catalog_to_ctx():
        from flask_babel import get_locale
        locale = get_locale()
        translations = TranslationsHelper.load(
            # There is only one directory with translations in Foris so it's OK.
            next(babel.translation_directories),
            [locale],
            babel.domain
        )
        return {'babel_catalog': translations.json_catalog, 'locale': locale}


def _get_locale_from_backend(app):
    # pylint: disable=fixme
    # TODO: better to cache.
    return app.backend.perform('web', 'get_data')['language']


def load_plugins(app):
    from .plugins import get_plugins

    plugins = get_plugins()
    for plugin in plugins:
        app.register_blueprint(plugin)

    @app.context_processor
    def add_plugins_to_ctx():
        return {'plugins': plugins, 'plugins_urls': [plugin.url_prefix for plugin in plugins]}
