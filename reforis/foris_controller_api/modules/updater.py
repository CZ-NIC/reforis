from http import HTTPStatus

from flask import current_app, jsonify, request
from flask_babel import gettext as _

from reforis import _get_locale_from_backend
from reforis.foris_controller_api.utils import APIError


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
    settings = current_app.backend.perform('updater', 'get_settings', {'lang': _get_locale_from_backend(current_app)})
    del settings['approval']

    response = None
    if request.method == 'GET':
        response = {
            **settings,
            'reboots': current_app.backend.perform('router_notifications', 'get_settings')['reboots'],
        }
        del response['user_lists']
        del response['languages']
    elif request.method == 'POST':
        # pylint: disable=fixme
        # TODO: If router_notifications is saved without errors and updater setting is saved with an error then user got
        # the error message even router_notifications are saved. It's probably better to make some rollback in case of
        # error here.
        data = request.json
        response_reboots = current_app.backend.perform('router_notifications', 'update_reboot_settings',
                                                       data['reboots'])
        del data['reboots']

        if data['enabled']:
            data['user_lists'] = [
                package['name'] for package in settings['user_lists'] if package['enabled']
            ]
            data['languages'] = [
                language['code'] for language in settings['languages'] if language['enabled']
            ]

        response_updater = current_app.backend.perform('updater', 'update_settings', data)
        response = {'result': response_reboots and response_updater}
    return jsonify(response)


def approvals():
    """
    .. http:get:: /api/approvals
        Get list of `update approvals`.
    .. http:post:: /api/approvals
        Update or dismiss `update approvals`.
        See ``resolve_approval`` action in the `foris-controller updater module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/foris-controller/blob/master/foris_controller_modules/updater/schema/updater.json>`_.

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


def packages():
    """
    .. http:get:: /api/packages
        Get `packages` router settings.
        See ``get_settings`` action in the `foris-controller updater module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/foris-controller/blob/master/foris_controller_modules/updater/schema/updater.json>`_.

    .. http:post:: /api/packages
        Set `packages` router settings.
        **It's not possible to change some `packages` settings if automatic updates are disabled.**
        See ``update_settings`` action in the `foris-controller updater module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/foris-controller/blob/master/foris_controller_modules/updater/schema/updater.json>`_.
    """
    updater_settings = current_app.backend.perform(
        'updater',
        'get_settings',
        {'lang': _get_locale_from_backend(current_app)}
    )
    del updater_settings['approval']
    response = None
    if request.method == 'GET':
        response = updater_settings
        del response['approval_settings']
    elif request.method == 'POST':
        if not updater_settings['enabled']:
            raise APIError(_('You can\'t set packages with disabled automatic updates.'))
        data = request.json
        data['enabled'] = True
        data['approval_settings'] = updater_settings['approval_settings']
        response = current_app.backend.perform('updater', 'update_settings', data)
    return jsonify(response)


def updates_run():
    response = current_app.backend.perform('updater', 'run', {'set_reboot_indicator': False})
    if response.get('result') is not True:
        return jsonify(_('Cannot start updater')), HTTPStatus.INTERNAL_SERVER_ERROR
    return jsonify(response)


def updates_status():
    return jsonify({'running': current_app.backend.perform('web', 'get_data')['updater_running']})


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
        'rule': '/updates/status',
        'view_func': updates_status,
        'methods': ['GET'],
    }, {
        'rule': '/approvals',
        'view_func': approvals,
        'methods': ['GET', 'POST'],
    }, {
        'rule': '/packages',
        'view_func': packages,
        'methods': ['GET', 'POST'],
    }
]
