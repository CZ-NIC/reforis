from flask import current_app, jsonify, request
from flask_babel import gettext as _

from reforis import _get_locale_from_backend
from reforis.foris_controller_api import APIError


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
        <https://gitlab.labs.nic.cz/turris/foris-controller/blob/master/foris_controller_modules/updater/schema/updater.json>`_.

        **Example request**:

        .. sourcecode:: http

            {
                "approval_settings": {"status": "on"},
                "enabled": true,
                "reboots": { "delay": 4, "time": "04:30"}
            }
    """
    response = None
    if request.method == 'GET':
        lang_data = {'lang': _get_locale_from_backend(current_app)}
        updater_settings = current_app.backend.perform('updater', 'get_settings', lang_data)
        response = {**updater_settings['approval'], 'update_automatically': updater_settings['enabled']}

    elif request.method == 'POST':
        data = request.json
        response = current_app.backend.perform('updater', 'resolve_approval', data)

    return jsonify(response)


def packages():
    """
    .. http:get:: /api/packages
        Get `packages` router settings.
        See ``get_settings`` action in the `foris-controller updater module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/blob/master/foris_controller_modules/updater/schema/updater.json>`_.

    .. http:post:: /api/packages
        Set `packages` router settings.
        **It's not possible to change some `packages` settings if automatic updates are disabled.**
        See ``update_settings`` action in the `foris-controller updater module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/blob/master/foris_controller_modules/updater/schema/updater.json>`_.
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


# pylint: disable=invalid-name
views = [
    {
        'rule': '/updates',
        'view_func': updates,
        'methods': ['GET', 'POST'],
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
