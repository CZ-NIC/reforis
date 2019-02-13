#  Copyright (C) 2018 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

from flask import Blueprint, render_template

demo_plugin = Blueprint(
    'Demo plugin',
    __name__,
    template_folder='templates',
    url_prefix='/demo_plugin'
)


@demo_plugin.route('/')
def view():
    return render_template('demo_plugin/index.html')
