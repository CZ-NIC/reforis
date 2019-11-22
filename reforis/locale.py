#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

"""
Flask-Babel can’t process JS codes in real-time because the entire JS code runs on the client machine in a browser. A
solution is using a small JavaScript library called babel.js. It’s a simple library that provides a gettext-like
translation interface https://github.com/python-babel/babel/blob/master/contrib/babel.js.

The translations catalog is generated using TranslationsHelper object. It’s a helper which is inherited from
:class:`babel.support.Translations` object in order to generate JSON translations dictionary with babel.js suitable
format. Then it is uploaded into JS code with Jinja2 template system.
"""

from babel.messages.plurals import get_plural
from babel.support import Translations, NullTranslations

from flask import json, current_app
from flask_babel import get_locale


class TranslationsHelper(Translations):
    """
    Allows to generate JSON catalog with right format to be loaded and used by ``babel.js`` library.

    See :func:`locale.get_timezone_translations` for examples.
    """

    @property
    def catalog(self):
        locale = self._info['language']
        return {
            'locale': locale,
            'plural_expr': get_plural(locale)[1],
            'domain': self.domain,
            'messages': self._get_messages()
        }

    def _get_messages(self):
        """
        Change format of plural forms to be accepted by js.
        """
        messages = self._catalog
        del messages['']
        res = {}
        for message_id, message in messages.items():
            if isinstance(message_id, tuple):
                message_id, idx = message_id
                res.setdefault(message_id, []).insert(idx, message)
            else:
                res[message_id] = message
        return res

    @property
    def json_catalog(self):
        return json.dumps(self.catalog, ensure_ascii=False)


def get_translations():
    return {
        'babel_catalog': _get_translations('messages', with_plugins=True).json_catalog,
        'babel_forisjs_catalog': _get_translations('forisjs').json_catalog,
        'babel_tzinfo_catalog': _get_translations('tzinfo').json_catalog,
    }


def _get_translations(domain, with_plugins=False):
    """
    Load translations by domain into :class:`locale.TranslationsHelper` object.

    :return: TranslationsHelper
    """
    babel = current_app.extensions['babel']
    translations = TranslationsHelper.load(
        # There is only one directory with translations in Foris so it's OK.
        next(babel.translation_directories),
        [get_locale()],
        domain
    )

    if with_plugins:
        for translation in _get_plugins_translations(domain):
            if not isinstance(translation, NullTranslations):
                translations.add(translation)

    return translations


def _get_plugins_translations(domain):
    translations = []
    for translation_path in current_app.plugin_translations:
        translation = Translations.load(
            translation_path,
            [get_locale()],
            domain
        )
        translations.append(translation)
    return translations
