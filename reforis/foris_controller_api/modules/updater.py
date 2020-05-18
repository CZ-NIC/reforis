#  Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

from http import HTTPStatus

from flask import current_app, jsonify, request
from flask_babel import gettext as _
from reforis import _get_locale_from_backend

from .utils import APIError


def updates():
    """
    .. http:get:: /api/updates
        Get `updates` router settings. It combines data from ``updater`` and ``router_notifications``
        ``foris-controller`` modules.

        **Example response**:

        .. sourcecode:: http

            {
                "approval_settings": {"status": "on"},
                "enabled": true,
                "reboots": { "delay": 4, "time": "04:30"}
            }

    .. http:post:: /api/updates
        Set `updates` router settings. It combines data from ``updater`` and ``router_notifications``
        ``foris-controller`` modules.

        **Example request**:

        .. sourcecode:: http

            {
                "approval_settings": {"status": "on"},
                "enabled": true,
                "reboots": { "delay": 4, "time": "04:30"}
            }
    """
    response = None
    reboot_settings = current_app.backend.perform('router_notifications', 'get_settings')['reboots']
    settings = current_app.backend.perform(
        'updater', 'get_settings',
        {'lang': _get_locale_from_backend(current_app)},
    )
    del settings['approval']
    if request.method == 'GET':
        response = {
            **settings,
            'reboots': reboot_settings,
        }
        del response['user_lists']
        del response['languages']
    elif request.method == 'POST':
        # Change automatic reboot settings
        data = request.json
        notifications_change_result = update_reboot_settings(data['reboots'])

        if notifications_change_result.get('result') is not True:
            return jsonify(_('Cannot change automatic restart settings.')), HTTPStatus.INTERNAL_SERVER_ERROR

        # Change update approvals settings
        del data['reboots']
        if data['enabled'] is True:
            data['user_lists'] = [
                package['name'] for package in settings['user_lists'] if package['enabled'] is True
            ]
            data['languages'] = [
                language['code'] for language in settings['languages'] if language['enabled'] is True
            ]

        approvals_change_result = current_app.backend.perform('updater', 'update_settings', data)

        if approvals_change_result.get('result') is not True:
            message = _('Cannot update approvals settings.')
            # Go back to initial notification settings
            rollback_result = update_reboot_settings(reboot_settings)
            if rollback_result.get('result') is not True:
                message = '{} {}'.format(message, _('Cannot rollback automatic restart settings.'))
            return jsonify(message), HTTPStatus.INTERNAL_SERVER_ERROR
        response = {'result': True}
    return jsonify(response)


def approvals():
    """
    .. http:get:: /api/approvals
        Get list of `update approvals`.
    .. http:post:: /api/approvals
        Update or dismiss `update approvals`.
        See ``resolve_approval`` action in the `foris-controller updater module JSON schema
        <https://gitlab.nic.cz/turris/foris-controller/foris-controller/blob/master/foris_controller_modules/updater/schema/updater.json>`_.

        **Example request**:

        .. sourcecode:: http
            {
                approvable: true,
                hash: "d529d9d94ac906435cef4124f76f90dbed071b09837ce150615ddfde95bc62ab",
                plan: [
                    { name: "base-files", new_ver: "194.2-611f08c.0", op: "install" },
                    { name: "luci-proto-ipv6", new_ver: "git-19.294.12576-b3ab814-1.0", op: "install" }
                ],
                present: true,
                reboot: false,
                status: "asked",
                time: "2019-10-21T06:58:28"
            }
    """
    response = None
    if request.method == 'GET':
        lang_data = {'lang': _get_locale_from_backend(current_app)}
        updater_settings = current_app.backend.perform('updater', 'get_settings', lang_data)

        # Updates that are delayed or need approval
        approvable = bool(
            updater_settings['enabled']
            and updater_settings['approval_settings']['status'] != 'off'
            and updater_settings['approval'].get('present') is True
            and updater_settings['approval'].get('status') == 'asked'
            and updater_settings['approval'].get('plan')  # Non-empty list of packages
        )

        response = {
            **updater_settings['approval'],
            'approvable': approvable,
        }
    elif request.method == 'POST':
        data = request.json
        response = current_app.backend.perform('updater', 'resolve_approval', data)

    return jsonify(response)


def packages_get():
    """
    .. http:get:: /api/packages
        Get `packages` router settings.
        See ``get_package_lists`` action in the `foris-controller updater module JSON schema
        <https://gitlab.nic.cz/turris/foris-controller/foris-controller/blob/master/foris_controller_modules/updater/schema/updater.json>`_.
    """
    updater_is_enabled = current_app.backend.perform('updater', 'get_enabled')

    response = current_app.backend.perform(
        'updater',
        'get_package_lists',
        {'lang': _get_locale_from_backend(current_app)}
    )
    return jsonify({**response, **updater_is_enabled})


def packages_set():
    """
    .. http:post:: /api/packages
        Set `packages` router settings.
        **It's not possible to change some `packages` settings if updater is disabled.**
        See ``update_package_lists`` action in the `foris-controller updater module JSON schema
        <https://gitlab.nic.cz/turris/foris-controller/foris-controller/blob/master/foris_controller_modules/updater/schema/updater.json>`_.
    """
    _check_updater_enabled()

    data = request.json
    response = current_app.backend.perform('updater', 'update_package_lists', data)
    return jsonify(response)


def updates_run():
    response = current_app.backend.perform('updater', 'run', {'set_reboot_indicator': False})
    if response.get('result') is not True:
        return jsonify(_('Cannot start updater')), HTTPStatus.INTERNAL_SERVER_ERROR
    return jsonify(response)


def updates_enabled():
    return jsonify(current_app.backend.perform('updater', 'get_enabled'))


def updates_running():
    return jsonify(current_app.backend.perform('updater', 'get_running'))


def language_packages_get():
    updater_is_enabled = current_app.backend.perform('updater', 'get_enabled')
    response = current_app.backend.perform('updater', 'get_languages')
    return jsonify({**response, **updater_is_enabled})


def language_packages_set():
    _check_updater_enabled()

    data = request.json
    response = current_app.backend.perform('updater', 'update_languages', data)
    return jsonify(response)


def _check_updater_enabled():
    updater_is_enabled = current_app.backend.perform('updater', 'get_enabled')['enabled']
    if not updater_is_enabled:
        raise APIError(_('You can\'t set it with disabled automatic updates.'))


# pylint: disable=invalid-name
views = [
    {
        'rule': '/updates',
        'view_func': updates,
        'methods': ['GET', 'POST'],
    }, {
        'rule': '/updates/run',
        'view_func': updates_run,
        'methods': ['POST'],
    }, {
        'rule': '/updates/enabled',
        'view_func': updates_enabled,
        'methods': ['GET'],
    }, {
        'rule': '/updates/running',
        'view_func': updates_running,
        'methods': ['GET'],
    }, {
        'rule': '/approvals',
        'view_func': approvals,
        'methods': ['GET', 'POST'],
    }, {
        'rule': '/packages',
        'view_func': packages_get,
        'methods': ['GET'],
    }, {
        'rule': '/packages',
        'view_func': packages_set,
        'methods': ['POST'],
    }, {
        'rule': '/language-packages',
        'view_func': language_packages_get,
        'methods': ['GET'],
    }, {
        'rule': '/language-packages',
        'view_func': language_packages_set,
        'methods': ['POST'],
    }
]


def update_reboot_settings(settings):
    return current_app.backend.perform(
        'router_notifications',
        'update_reboot_settings',
        settings,
    )
