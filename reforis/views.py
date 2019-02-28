#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.


from flask import Blueprint, render_template, request, redirect, url_for, session

from reforis.auth import login_to_foris, logout_from_foris

base = Blueprint(
    'Foris',
    __name__,
    template_folder='templates',
)


@base.route('/')
def index():
    return render_template('base.html')


@base.route('/login', methods=['GET', 'POST'])
def login():
    if session.get('logged', False):
        return redirect(url_for('Foris.index'))

    if request.method == 'POST':
        password = request.form['password']
        res = login_to_foris(password)
        if res:
            return redirect(url_for('Foris.index'))

    return render_template('login.html')


@base.route('/logout')
def logout():
    logout_from_foris()
    return redirect(url_for('Foris.login'))


@base.route('/wifi/')
def wifi():
    return render_template('wifi.html')
