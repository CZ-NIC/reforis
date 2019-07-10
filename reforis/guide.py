#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

"""
The ForisGuide Blueprints provides a simple page with rendering guide template with guide container. Then React
application can put all required content into that.
"""

from flask import Blueprint, render_template, current_app, redirect, url_for

# pylint: disable=invalid-name
guide = Blueprint('ForisGuide', __name__, url_prefix='/guide')


# pylint: disable=unused-argument
@guide.route('/', defaults={'path': ''})
@guide.route('/<path:path>')
def index(path):
    """Guide page. All subsequent communications is done using API `guide` endpoints."""
    web_data = current_app.backend.perform('web', 'get_data')
    if not web_data['guide']['enabled']:
        return redirect(url_for('Foris.index'))
    return render_template('guide/index.html')
