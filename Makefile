#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

.PHONY: all install run run-js clean

SHELL=/bin/bash
PYTHON=python3.6
FLASK=flask

JS_DIR=./js

export FLASK_ENV=development
export FLASK_APP=reforis
export FORIS_BUS=ubus

all:
	@echo "make prepare-dev"
	@echo "    Create python virtual environment and install dependencies."
	@echo "make lint"
	@echo "    Run list on project."
	@echo "make test"
	@echo "    Run tests on project."
	@echo "make run"
	@echo "    Run server."
	@echo "make clean"
	@echo "    Remove python artifacts and virtualenv."
	@echo "make build"
	@echo "    Creates debian package."
	@echo "make install"
	@echo "    Installs package in your system."


install: setup.py reforis_demo_plugin/setup.py
	${PYTHON} setup.py install
	cd reforis_demo_plugin; ${PYTHON} setup.py install

install-js: js/package.json
	cd ${JS_DIR}; npm install --save-dev

run:
	${FLASK} run --host="0.0.0.0" --port=81

run-js:
	cd ${JS_DIR};\
	npx watchify app.js -o ../reforis/static/js/app.min.js -t [ babelify --presets [ @babel/preset-env @babel/preset-react ] --plugins [ @babel/plugin-proposal-class-properties ] ]


create-messages:
	pybabel extract -F babel.cfg -o ./reforis/translations/messages.pot .

update-messages:
	pybabel update -i ./reforis/translations/messages.pot -d ./reforis/translations

compile-messages:
	pybabel compile -f -d ./reforis/translations


clean:
	find . -name '*.pyc' -exec rm -f {} +
	rm -rf $(VENV_NAME) *.eggs *.egg-info dist build docs/_build .cache
	rm -rf reforis_demo_plugin/dist reforis_demo_plugin/build reforis_demo_plugin/*.egg-info
	rm -rf js/node_modules/ reforis/static/js/app.min.js
	${PYTHON} -m pip uninstall -y reforis
	${PYTHON} -m pip uninstall -y reforis_demo_plugin
