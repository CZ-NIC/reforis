#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.


from flask import Blueprint, current_app, redirect, render_template, request, session, url_for
from flask_babel import get_locale
from flask_babel import gettext as _

from reforis import TranslationsHelper
from reforis.auth import login_to_foris, logout_from_foris

views = Blueprint(  # pylint: disable=invalid-name
    'Foris',
    __name__,
    static_folder='/tmp/',
    static_url_path='/static',
    template_folder='templates',
)


@views.route('/', methods=['GET'])
def overview():
    return render_template('overview.html')


@views.route('/login', methods=['GET', 'POST'])
def login():
    error_message = None
    if session.get('logged', False):
        return redirect(url_for('Foris.overview'))

    if request.method == 'POST':
        password = request.form['password']
        if login_to_foris(password):
            return redirect(url_for('Foris.overview'))
        error_message = _('Wrong password.')
    return render_template('login.html', error_message=error_message)


@views.route('/logout', methods=['GET'])
def logout():
    logout_from_foris()
    return redirect(url_for('Foris.login'))


@views.route('/notifications', methods=['GET'])
def notifications():
    return render_template('notifications.html')


@views.route('/wifi', methods=['GET'])
def wifi():
    return render_template('network_settings/wifi.html')


@views.route('/wan', methods=['GET'])
def wan():
    return render_template('network_settings/wan.html')


@views.route('/lan', methods=['GET'])
def lan():
    return render_template('network_settings/lan.html')


@views.route('/dns', methods=['GET'])
def dns():
    return render_template('network_settings/dns.html')


@views.route('/interfaces', methods=['GET'])
def interfaces():
    return render_template('network_settings/interfaces.html')


@views.route('/guest-network', methods=['GET'])
def guest_network():
    return render_template('network_settings/guest_network.html')


@views.route('/password', methods=['GET'])
def password():
    return render_template('administration/password.html')


@views.route('/region-and-time', methods=['GET'])
def region_and_time():
    babel = current_app.extensions['babel']
    translations = TranslationsHelper.load(
        # There is only one directory with translations in Foris so it's OK.
        next(babel.translation_directories),
        [get_locale()],
        'tzinfo'
    )
    return render_template('administration/region_and_time.html', babel_tzinfo_catalog=translations.json_catalog)


@views.route('/notifications-settings', methods=['GET'])
def notifications_settings():
    return render_template('administration/notifications_settings.html')


@views.route('/reboot', methods=['GET'])
def reboot():
    return render_template('administration/reboot.html')


@views.route('/updates', methods=['GET'])
def updates():
    return render_template('updates.html')


@views.route('/packages', methods=['GET'])
def packages():
    return render_template('packages.html')


@views.route('/about', methods=['GET'])
def about():
    return render_template('about.html', **current_app.backend.perform('about', 'get'))
