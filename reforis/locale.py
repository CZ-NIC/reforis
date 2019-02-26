#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

from babel.messages.plurals import get_plural
from babel.support import Translations

from flask import json


def set_locale():
    pass


class TranslationsHelper(Translations):
    def __init__(self, *args, **kwargs):
        super(TranslationsHelper, self).__init__(*args, **kwargs)
        locale = self._info['language']
        self.catalog = {
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
