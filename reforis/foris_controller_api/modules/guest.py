from reforis.foris_controller_api.utils import _foris_controller_settings_call


def guest_network():
    """
    .. http:get:: /api/guest-network
        Get `guest network` router settings.
        See ``get_settings`` action in the `foris-controller guest module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/blob/master/foris_controller_modules/guest/schema/guest.json>`_.

    .. http:post:: /api/guest-network
        Get `guest network` router settings.
        See ``update_settings`` action in the `foris-controller guest module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/blob/master/foris_controller_modules/guest/schema/guest.json>`_.
    """
    return _foris_controller_settings_call('guest')


# pylint: disable=invalid-name
views = [{
    'rule': '/guest-network',
    'view_func': guest_network,
    'methods': ['GET', 'POST']
}]
