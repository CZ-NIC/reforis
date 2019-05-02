#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.
import json

from flask import render_template

from reforis.auth import register_login_required
from .locale import TranslationsHelper


def create_app(config):
    from flask import Flask
    app = Flask(__name__)
    app.config.from_pyfile(f'config/{config}.py')

    from flask_session import Session
    Session(app)

    set_backend(app)
    set_locale(app)

    register_login_required(app)

    from .views import views
    from .api import api
    app.register_blueprint(views)
    app.register_blueprint(api)

    load_plugins(app)

    app.register_error_handler(404, not_found_error)
    app.register_error_handler(500, internal_error)
    from reforis.backend import ExceptionInBackend
    app.register_error_handler(ExceptionInBackend, foris_controller_error)

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

    controller_id = app.config.get('CONTROLLER_ID', None)
    if not controller_id:
        controller_id = _get_controller_id()

    from .backend import Backend
    app.backend = Backend(name=bus, **bus_config, controller_id=controller_id)


def _get_controller_id():
    # TODO: only for dev. Delete it and put to config.
    import subprocess
    return subprocess.check_output(['crypto-wrapper', 'serial-number']).decode("utf-8")[:-1]


def set_locale(app):
    from flask_babel import Babel
    babel = Babel(app)

    @babel.localeselector
    def get_locale():
        # TODO: catch exception here
        return _get_locale_from_backend(app)

    @app.context_processor
    def add_translations_catalog_to_ctx():
        from flask_babel import get_locale
        # TODO: catch exception here
        translations = TranslationsHelper.load(
            # There is only one directory with translations in Foris so it's OK.
            next(babel.translation_directories),
            [get_locale()],
            babel.domain
        )
        return {'babel_catalog': translations.json_catalog}


# TODO: Delete this function if it's not needed
def set_notifications(app):
    @app.context_processor
    def add_notifications_to_ctx():
        return app.backend.perform('router_notifications', 'list', {'lang': _get_locale_from_backend(app)})


# TODO: Put it to utils
# TODO: cache it somehow?
def _get_locale_from_backend(app):
    return app.backend.perform('web', 'get_data')['language']


def load_plugins(app):
    from .plugins import get_plugins

    plugins = get_plugins()
    for plugin in plugins:
        app.register_blueprint(plugin)

    @app.context_processor
    def add_plugins_to_ctx():
        return {'plugins': plugins}
