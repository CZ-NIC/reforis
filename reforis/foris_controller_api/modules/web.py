from flask import current_app, jsonify, request


def guide():
    """Get guide steps."""
    response = {
        **current_app.backend.perform('web', 'get_data')['guide'],
        **current_app.backend.perform('web', 'get_guide'),
    }
    return jsonify(response)


def finish_guide():
    """
        Skip guide.
        See ``update_guide``  action in the `foris-controller web module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/foris-controller/blob/master/foris_controller_modules/web/schema/web.json>`_.
    """
    response = current_app.backend.perform('web', 'update_guide', {'enabled': False})
    return jsonify(response)


def guide_workflow():
    """
        Choose guide workflow.
        See ``update_guide``  action in the `foris-controller web module JSON schema
        <https://gitlab.labs.nic.cz/turris/foris-controller/foris-controller/blob/master/foris_controller_modules/web/schema/web.json>`_.
    """
    data = request.json
    response = current_app.backend.perform('web', 'update_guide', {'enabled': True, **data})
    return jsonify(response)


def languages():
    """Get list of installed interface languages.

    **Example response**:

    .. sourcecode:: http

        ["en", "cz", "ru"]
    """
    return jsonify(current_app.backend.perform('web', 'list_languages')['languages'])


def language():
    """
    .. http:get:: /api/language
        Get a current language.

        **Example response**:

        .. sourcecode:: http

            "en"

    .. http:post:: /api/language
        Set a current language.

        **Example request**:

        .. sourcecode:: http

            {"language" : "en"}
    """
    res = None
    if request.method == 'GET':
        res = current_app.backend.perform('web', 'get_data')['language']
    elif request.method == 'POST':
        res = current_app.backend.perform('web', 'set_language', request.json)
    return jsonify(res)


# pylint: disable=invalid-name
views = [
    {
        'rule': '/guide',
        'view_func': guide,
        'methods': ['GET']
    }, {
        'rule': '/finish-guide',
        'view_func': finish_guide,
        'methods': ['POST']
    }, {
        'rule': '/guide-workflow',
        'view_func': guide_workflow,
        'methods': ['POST']
    }, {
        'rule': '/language',
        'view_func': language,
        'methods': ['GET', 'POST']
    }, {
        'rule': '/languages',
        'view_func': languages,
        'methods': ['GET']
    },
]
