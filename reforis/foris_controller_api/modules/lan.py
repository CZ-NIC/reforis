from reforis.foris_controller_api.utils import _foris_controller_settings_call


def lan():
    """
    .. http:get:: /api/lan
        Get LAN router settings.
        See ``get_settings`` action in the `foris-controller lan module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/blob/master/foris_controller_modules/lan/schema/lan.json>`_.

    .. http:post:: /api/lan
        Get LAN router settings.
        See ``update_settings`` action in the `foris-controller lan module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/blob/master/foris_controller_modules/lan/schema/lan.json>`_.
    """
    return _foris_controller_settings_call('lan')


# pylint: disable=invalid-name
views = [{
    'rule': '/lan',
    'view_func': lan,
    'methods': ['GET', 'POST']
}]
