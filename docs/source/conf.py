# Configuration file for the Sphinx documentation builder.
#
# This file only contains a selection of the most common options. For a full
# list see the documentation:
# http://www.sphinx-doc.org/en/master/config

# -- Path setup --------------------------------------------------------------

# If extensions (or modules to document with autodoc) are in another directory,
# add these directories to sys.path here. If the directory is relative to the
# documentation root, use os.path.abspath to make it absolute, like shown here.
#
import os
import sys

from docs.source.import_mock import Mock

sys.path.insert(0, os.path.abspath('../../reforis'))
sys.setrecursionlimit(1500)

# -- Project information -----------------------------------------------------

project = 'reForis'
copyright = '2019, CZ.NIC'
author = 'CZ.NIC'

# The full version, including alpha/beta/rc tags
release = '0.2'

# -- General configuration ---------------------------------------------------

# Add any Sphinx extension module names here, as strings. They can be
# extensions coming with Sphinx (named 'sphinx.ext.*') or your custom
# ones.
extensions = [
    'sphinx.ext.autodoc',
    'sphinx.ext.intersphinx',
    'sphinx.ext.viewcode',
    'sphinxcontrib.httpdomain',
    'sphinxcontrib.autohttp.flask',
    'sphinxcontrib.autohttp.flaskqref',
]

# Add any paths that contain templates here, relative to this directory.
templates_path = ['_templates']

# List of patterns, relative to source directory, that match files and
# directories to ignore when looking for source files.
# This pattern also affects html_static_path and html_extra_path.
exclude_patterns = []

# -- Options for HTML output -------------------------------------------------

# The theme to use for HTML and HTML Help pages.  See the documentation for
# a list of builtin themes.
#
html_theme = 'alabaster'

# Add any paths that contain custom static files (such as style sheets) here,
# relative to this directory. They are copied after the builtin static files,
# so a file named "default.css" will overwrite the builtin "default.css".
html_static_path = ['_static']

MOCK_MODULES = [
    'foris_client',
    'foris_client.buses',
    'foris_client.buses.base',
    'foris_client.buses.mqtt'
]

sys.modules.update((mod_name, Mock()) for mod_name in MOCK_MODULES)

import docs.source.http_directive_patch
