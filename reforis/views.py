#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

"""
The `ForisViews` Blueprint defines very simple views which render single pages with a template. These views don’t have
any logic in them because all further communication between client and server goes via AJAX calls using reForis API
which is done in `ForisAPI` Blueprint.
"""

from flask import Blueprint, current_app, redirect, render_template, request, session, url_for
from flask_babel import gettext as _
from reforis.auth import login_to_foris, logout_from_foris
from reforis.locale import get_timezone_translations

# pylint: disable=invalid-name
views = Blueprint('Foris', __name__)


@views.route('/', methods=['GET'])
def overview():
    """Overview page"""
    return render_template('overview.html')


@views.route('/login', methods=['GET', 'POST'])
def login():
    """
    .. http:get:: /login
        Login page

    .. http:post:: /login
        Perform login.

        **Example request**:

        .. sourcecode:: http

            {"password" : "foris_password"}
    """
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
    """Logout from foris."""
    logout_from_foris()
    return redirect(url_for('Foris.login'))


@views.route('/notifications', methods=['GET'])
def notifications():
    """Notifications page"""
    return render_template('notifications.html')


@views.route('/wifi', methods=['GET'])
def wifi():
    """WiFi settings page"""
    return render_template('network_settings/wifi.html')


@views.route('/wan', methods=['GET'])
def wan():
    """WAN settings page"""
    return render_template('network_settings/wan.html')


@views.route('/lan', methods=['GET'])
def lan():
    """WAN settings page"""
    return render_template('network_settings/lan.html')


@views.route('/dns', methods=['GET'])
def dns():
    """DNS settings page"""
    return render_template('network_settings/dns.html')


@views.route('/interfaces', methods=['GET'])
def interfaces():
    """Network interfaces settings page"""
    return render_template('network_settings/interfaces.html')


@views.route('/guest-network', methods=['GET'])
def guest_network():
    """Guest network settings page"""
    return render_template('network_settings/guest_network.html')


@views.route('/password', methods=['GET'])
def password():
    """Root and foris password settings page"""
    return render_template('administration/password.html')


@views.route('/region-and-time', methods=['GET'])
def region_and_time():
    """Region and time settings page"""
    translations = get_timezone_translations()
    return render_template('administration/region_and_time.html', babel_tzinfo_catalog=translations.json_catalog)


@views.route('/notifications-settings', methods=['GET'])
def notifications_settings():
    """Notifications settings page"""
    return render_template('administration/notifications_settings.html')


@views.route('/reboot', methods=['GET'])
def reboot():
    """Reboot device page"""
    return render_template('administration/reboot.html')


@views.route('/updates', methods=['GET'])
def updates():
    """Updates settings page"""
    return render_template('updates.html')


@views.route('/packages', methods=['GET'])
def packages():
    """Packages settings page"""
    return render_template('packages.html')


@views.route('/about', methods=['GET'])
def about():
    """About page"""
    return render_template('about.html', **current_app.backend.perform('about', 'get'))


# pylint: disable=inconsistent-return-statements
@views.before_request
def guide_redirect():
    if request.endpoint in ['Foris.logout', 'Foris.login']:
        return
    web_data = current_app.backend.perform('web', 'get_data')
    if web_data['guide']['enabled']:
        return redirect(url_for('ForisGuide.index'))
