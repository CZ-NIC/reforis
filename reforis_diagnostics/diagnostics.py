#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

from flask import Blueprint, render_template

diagnostics = Blueprint(
    'Diagnostics',
    __name__,
    template_folder='templates',
    url_prefix='/diagnostics'
)


@diagnostics.route('/')
def view():
    return render_template('diagnostics/index.html')
