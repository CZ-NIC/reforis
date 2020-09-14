#!/usr/bin/env python3

#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

import copy
import pathlib

import setuptools
from setuptools.command.build_py import build_py

BASE_DIR = pathlib.Path(__file__).absolute().parent


class CustomBuild(build_py):
    def run(self):
        # build package
        build_py.run(self)

        from reforis_distutils import ForisBuild
        cmd = ForisBuild(copy.copy(self.distribution))
        cmd.root_path = BASE_DIR
        cmd.build_lib = self.build_lib
        cmd.ensure_finalized()
        cmd.run()


setuptools.setup(
    name='reforis',
    version='0.9.4',
    packages=setuptools.find_packages(exclude=['tests']),
    include_package_data=True,

    description='The reForis, redesigned Foris router configuration web interface.',
    long_description='',
    url='https://gitlab.labs.nic.cz/turris/reforis/reforis',
    author='CZ.NIC, z. s. p. o.',
    author_email='bogdan.bodnar@nic.cz',

    install_requires=[
        'flask',
        'Babel',
        'Flask-Babel',
        'Flask-SeaSurf',
        'flup',
        'cachelib',
    ],
    setup_requires=[
        'Babel',
        'reforis_distutils',
    ],
    dependency_links=[
        "git+https://gitlab.labs.nic.cz/turris/reforis/reforis-distutils.git#egg=reforis-distutils",
    ],

    # Do not use test_require or build_require, because then it's not installed and is
    # able to be used only by setup.py util. We want to use it manually.
    # Actually it could be all in dev-requirements.txt but it's good to have it here
    # next to run dependencies and have it separated by purposes.
    extras_require={
        'devel': [
            'l18n==2018.5',
            'pycountry==18.12.8',
            'pytest==3.7.1',
            'pycodestyle==2.5.0',
            'pylint==2.3.1',
            'pylint-quotes==0.2.1',
            'foris-client @ git+https://gitlab.labs.nic.cz/turris/foris-controller/foris-client@master#egg=foris-client',
            'paho-mqtt==1.5.0',
        ],
        'build': [
            'Sphinx==2.1.2',
            'sphinxcontrib-httpdomain==1.7.0',
        ],
    },

    classifiers=[
        'Framework :: Flask',
        'Intended Audience :: End Users/Desktop',
        'Development Status :: 2 - Pre-Alpha',
        'License :: OSI Approved :: GNU General Public License v3 or later (GPLv3+)',
        'Natural Language :: English',
        'Operating System :: POSIX :: Linux',
        'Programming Language :: Python :: 3.7',
        'Topic :: System :: Networking',
    ],
    zip_safe=False,
    cmdclass={
        'build_py': CustomBuild,
    },
    entry_points={'console_scripts': [
        'reforis = reforis.__main__:main',
        'reforis-cli = reforis.cli:cli',
    ]},
)
