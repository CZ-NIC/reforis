#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

"""
The plugin system is implemented with Flask Blueprints. A developer can define routes, templates and all the logic of
a plugin as he wishes without any limitations. Moreover, the developer is not restricted in JS libraries or frameworks
to develop plugins.

A resulting plugin can be provided as a Python module with installation via setup.py script. This approach allows to
define modules which can be automatically registered and integrated into Foris application. Each Foris plugin must to
define so-called ``entry_points`` section in their setup.py file. The ``entry_points`` section should contain an
entry point with a name defined in ``foris.plugins`` section and a path to a Blueprint definition.

**Example of the plugin registration**

.. code-block:: python

    # setup.py
    setuptools.setup(
        name='reforis_diagnostics',
        # ...
        entry_points={
        'foris.plugins':
        'diagnostics = reforis_diagnostics:diagnostics'
        },
        # ...
    )

Static files
############
Static files (such as images, .css and .js) are stored into a separate Python module ``reforis_static``. It’s done to
provide singe static root to the lighttpd server.

Demo plugin
###########

See ``reforis_diagnostics`` plugin `repository <https://gitlab.labs.nic.cz/turris/reforis-diagnostics>`_.
"""

import pkg_resources


def get_plugins():
    """
    Iterate over ``foris.plugins`` entry points and return loaded plugins.

    :return: list of loaded entry_points
    """
    return [entry_point.load() for entry_point in pkg_resources.iter_entry_points('foris.plugins')]
