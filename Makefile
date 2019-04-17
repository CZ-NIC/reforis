#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

.PHONY: all install run run-js test test-web clean

SHELL=/bin/bash
PYTHON=python3.6
FLASK=flask

VENV_NAME?=venv
VENV_BIN=$(shell pwd)/${VENV_NAME}/bin
VENV_ACTIVATE=. ${VENV_BIN}/activate

JS_DIR=./js

export FLASK_APP=reforis:create_app('dev')
export FLASK_ENV=development

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

run-ws:
	foris-ws  --host "0.0.0.0" --port 9081 -a filesystem -d mqtt --mqtt-host localhost --mqtt-port 11883 \
	--mqtt-passwd-file '/etc/fosquitto/credentials.plain';

watch-js:
	cd ${JS_DIR};\
	npx watchify ./src/app.js -o ../reforis/static/js/app.min.js \
	-t [ babelify --presets [ @babel/preset-env @babel/preset-react ] --plugins [ @babel/plugin-proposal-class-properties ] ]

test-venv: $(VENV_NAME)/bin/activate
$(VENV_NAME)/bin/activate: setup.py
	test -d $(VENV_NAME) || virtualenv -p python3.7 $(VENV_NAME)
	${VENV_BIN}/${PYTHON} -m pip install -e .[devel]
	touch $(VENV_NAME)/bin/activate

test: test-js test-web
test-js:
	cd js; npm test
test-web: test-venv
	${VENV_BIN}/${PYTHON} -m pytest -vv tests

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
