#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

.PHONY: all prepare-dev venv install install-reforis run run-js run-ws watch-js compile-js lint-js lint-web test test-web test-js-update-snapshots clean

DEV_PYTHON=python3.7
VENV_NAME?=venv
VENV_BIN=$(shell pwd)/$(VENV_NAME)/bin
VENV_ACTIVATE=. $(VENV_BIN)/activate

JS_DIR=./js

ROUTER_PYTHON=python3.6
FLASK=flask

export FLASK_APP=reforis:create_app('dev')
export FLASK_ENV=development

all:
	@echo "make prepare-dev"
	@echo "    Create python virtual environment and install dependencies."
	@echo "make lint"
	@echo "    Run list on project."
	@echo "make test"
	@echo "    Run tests on project."
	@echo "make install"
	@echo "    Install package in your system (for running on router)."
	@echo "make watch-js:"
	@echo "    Run babel to compile JS in watch mode."
	@echo "make run"
	@echo "    Run Flask server."
	@echo "make run-ws"
	@echo "    Run WebSocket server."
	@echo "make create-messages"
	@echo "    Create locale messages (.pot)."
	@echo "make update-messages"
	@echo "    Update locale messages from .pot file."
	@echo "make compile-messages"
	@echo "    Compile locale messager."
	@echo "make timezones"
	@echo "    Generate JS file with timezones."
	@echo "make clean"
	@echo "    Remove python artifacts and virtualenv."

prepare-dev:
	which npm || curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
	which npm || sudo apt install -y nodejs
	cd js; npm install

	which $(DEV_PYTHON) || sudo apt install -y $(DEV_PYTHON) $(DEV_PYTHON)-pip
	which virtualenv || sudo $(DEV_PYTHON) -m pip install virtualenv
	make venv

venv: $(VENV_NAME)/bin/activate
$(VENV_NAME)/bin/activate: setup.py
	test -d $(VENV_NAME) || virtualenv -p $(DEV_PYTHON) $(VENV_NAME)
	# Some problem in latest version of setuptools during extracting translations.
	$(VENV_BIN)/$(DEV_PYTHON) -m pip install -U pip setuptools==39.1.0
	$(VENV_BIN)/$(DEV_PYTHON) -m pip install -e .[devel]
	touch $(VENV_NAME)/bin/activate

install: setup.py
	$(ROUTER_PYTHON) -m pip install -e .

install-js: js/package.json
	cd $(JS_DIR); npm install --save-dev

run:
	$(FLASK) run --host="0.0.0.0" --port=81

run-ws:
	foris-ws  --host "0.0.0.0" --port 9081 -a filesystem -d mqtt --mqtt-host localhost --mqtt-port 11883 \
	--mqtt-passwd-file '/etc/fosquitto/credentials.plain';

watch-js:
	cd $(JS_DIR); npm run-script watch
build-js:
	cd $(JS_DIR); npm run-script build

lint: lint-js lint-web
lint-js:
	cd js; npm run lint
lint-web: venv
	$(VENV_BIN)/$(DEV_PYTHON) -m pylint --rcfile=pylintrc reforis
	$(VENV_BIN)/$(DEV_PYTHON) -m pycodestyle --config=pycodestyle reforis

test: test-js test-web
test-js:
	cd js; npm test
test-web: venv
	$(VENV_BIN)/$(DEV_PYTHON) -m pytest -vv tests

test-js-update-snapshots:
	cd js; npm test -- -u

create-messages: venv
	$(VENV_BIN)/pybabel extract -F babel.cfg -o ./reforis/translations/messages.pot .
update-messages: venv
	$(VENV_BIN)/pybabel update -i ./reforis/translations/messages.pot -d ./reforis/translations
	$(VENV_BIN)/pybabel update -i ./reforis/translations/tzinfo.pot -d ./reforis/translations -D tzinfo
compile-messages: venv
	$(VENV_BIN)/pybabel compile -f -d ./reforis/translations
	$(VENV_BIN)/pybabel compile -f -d ./reforis/translations -D tzinfo

docs: docs-web docs-js
docs-web: venv
	rm -rf docs/build
	. $(VENV_BIN)/activate && cd docs; make html
docs-js:
	cd js; npm run-script docs

make_timzezones:
	$(VENV_BIN)/$(DEV_PYTHON) ./scripts/make_timezones.py ./js/src/utils/timezones.js

clean:
	find . -name '*.pyc' -exec rm -f {} +
	rm -rf $(VENV_NAME) *.eggs *.egg-info dist build docs/_build .cache
	rm -rf js/node_modules/ reforis_static/reforis/js/app.min.js
	$(ROUTER_PYTHON) -m pip uninstall -y reforis
