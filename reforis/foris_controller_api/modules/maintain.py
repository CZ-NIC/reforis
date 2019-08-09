from flask import jsonify, current_app


def reboot():
    """
        Trigger device reboot.
        See ``reboot``  action in the `foris-controller maintain module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/blob/master/foris_controller_modules/maintain/schema/maintain.json>`_.
    """
    return jsonify(current_app.backend.perform('maintain', 'reboot'))


views = [{
    'rule': '/reboot',
    'view_func': reboot,
    'methods': ['POST']
}]
