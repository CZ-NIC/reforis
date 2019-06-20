#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

from flask import current_app
from flask_babel import get_locale

from reforis import TranslationsHelper


def get_timezone_translations():
    babel = current_app.extensions['babel']
    return TranslationsHelper.load(
        # There is only one directory with translations in Foris so it's OK.
        next(babel.translation_directories),
        [get_locale()],
        'tzinfo'
    )
