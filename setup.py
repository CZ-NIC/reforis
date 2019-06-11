#!/usr/bin/env python3

#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

import os

import setuptools
from setuptools.command.build_py import build_py

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


class NPMInstall(build_py):
    def run(self):
        build_py.run(self)
        npm_install_and_build(self.build_lib)


def npm_install_and_build(path):
    os.system('cd {}/js; npm install --save-dev'.format(BASE_DIR))
    build_dir = os.path.join(BASE_DIR, path, 'reforis')
    os.system(
        f'cd {BASE_DIR}/js; npx browserify ./src/app.js -o {build_dir}/static/js/app.min.js -t [ babelify --presets [ @babel/preset-env @babel/preset-react ] --plugins [ @babel/plugin-proposal-class-properties ] ]'
    )


setuptools.setup(
    name='reforis',
    version='0.2',
    packages=setuptools.find_packages(exclude=['tests']),
    include_package_data=True,

    description='The reForis, redesigned Foris router configuration web interface.',
    long_description='',
    author='Bogdan Bodnar',

    # All versions are fixed just for case. Once in while try to check for new versions.
    install_requires=[
        'flask==1.0.2',
        'Babel==2.7.0',
        'Flask-Babel==0.12.2',
        'Flask-Session==0.3.1',
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
        'build_py': NPMInstall
    },
    package_data={
        "": ["static/js/app.min.js"],
    }
)
