#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

from flask import Blueprint, render_template, current_app, redirect, url_for

# pylint: disable=invalid-name
from reforis.utils import get_timezone_translations

guide = Blueprint('ForisGuide', __name__, url_prefix='/guide')


@guide.route('/', defaults={'path': ''})
@guide.route('/<path:path>')
def index(path):
    web_data = current_app.backend.perform('web', 'get_data')
    if not web_data['guide']['enabled']:
        return redirect(url_for('Foris.overview'))
    translations = get_timezone_translations()

    return render_template('guide/index.html', babel_tzinfo_catalog=translations.json_catalog)
