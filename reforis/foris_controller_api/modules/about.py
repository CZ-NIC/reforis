import os

from flask import current_app, jsonify


def about():
    """
        About.
        See ``get``  action in the `foris-controller about module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/foris-controller/blob/master/foris_controller_modules/about/schema/about.json>`_.
    """
    data = current_app.backend.perform('about', 'get')
    data['serial'] = int(data['serial'], 16)
    return jsonify(data)


def controller_id():
    """
        Return controller ID of current device.
    """
    return jsonify(os.environ.get('CONTROLLER_ID'))


# pylint: disable=invalid-name
views = [
    {
        'rule': '/about',
        'view_func': about,
        'methods': ['GET']
    },
    {
        'rule': '/controller_id',
        'view_func': controller_id,
        'methods': ['GET']
    },
]
