#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.


from flask import Blueprint, render_template

base = Blueprint(
    'Foris',
    __name__,
    template_folder='templates',
)


@base.route('/')
def view():
    return render_template('base.html')


@base.route('/wifi/')
def wifi():
    return render_template('wifi/index.html')
