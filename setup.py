#!/usr/bin/env python3

#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

import copy
import os
import pathlib
import re

import setuptools
from setuptools.command.build_py import build_py

BASE_DIR = pathlib.Path(__file__).absolute().parent





class CustomBuild(build_py):
    def run(self):
        build_py.run(self)
        self.npm_install_and_build()
        self.copy_translations_from_forisjs()
        self.compile_translations()

    def npm_install_and_build(self):
        os.system(f'cd {BASE_DIR}/js; npm install --save-dev')
        build_dir = BASE_DIR / self.build_lib / 'reforis_static/reforis/js'
        os.system(f'cd {BASE_DIR}/js; npm run-script build -- -o {build_dir}/app.min.js')

    def copy_translations_from_forisjs(self):
        for po in BASE_DIR.glob('js/node_modules/foris/translations/*/LC_MESSAGES/forisjs.po'):
            lang = pathlib.Path(po).parent.parent.name
            path_to_copy = BASE_DIR / f'reforis/translations/{lang}/LC_MESSAGES/forisjs.po'
            os.system(f'cp {po} {path_to_copy}')

    def compile_translations(self):
        def compile_language(domain, path):
            from babel.messages import frontend as babel
            distribution = copy.copy(self.distribution)
            cmd = babel.compile_catalog(distribution)
            cmd.input_file = str(path)
            lang = re.match(r".*/reforis/translations/([^/]+)/LC_MESSAGES/.*po", str(path)).group(1)
            out_path = BASE_DIR / self.build_lib / f"reforis/translations/{lang}/LC_MESSAGES/{domain}.mo"
            out_path.parent.mkdir(parents=True, exist_ok=True)
            cmd.output_file = str(out_path)
            cmd.domain = domain
            cmd.ensure_finalized()
            cmd.run()

        def compile_domain(domain):
            for path in BASE_DIR.glob(f'reforis/translations/*/LC_MESSAGES/{domain}.po'):
                compile_language(domain, path)

        compile_domain('messages')
        compile_domain('tzinfo')
        compile_domain('forisjs')


setuptools.setup(
    name='reforis',
    version='0.4.2',
    packages=setuptools.find_packages(exclude=['tests']),
    include_package_data=True,

    description='The reForis, redesigned Foris router configuration web interface.',
    long_description='',
    author='Bogdan Bodnar',

    # All versions are fixed just for case. Once in while try to check for new versions.
    install_requires=[
        'flask',
        'Babel',
        'Flask-Babel',
        'Flask-Session',
        'Flask-SeaSurf',
        'flup',
    ],

    setup_requires=[
        'Babel',
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
