#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

.PHONY: all prepare-dev prepare-docs venv install install-with-lighttpd install-js run run-ws watch-js build-js lint lint-js lint-js-fix lint-web test test-js test-web test-js-update-snapshots create-messages update-messages compile-messages docs docs-web docs-js timezones clean

DEV_PYTHON=python3.7
VENV_NAME?=venv
VENV_BIN=$(shell pwd)/$(VENV_NAME)/bin

JS_DIR=./js

ROUTER_PYTHON_VERSION=3.6
ROUTER_PYTHON=python$(ROUTER_PYTHON_VERSION)

FLASK=flask

export FLASK_APP=reforis:create_app('dev')
export FLASK_ENV=development

all:
	@echo "make prepare-dev"
	@echo "    Create python virtual environment and install dependencies."
	@echo "make prepare-docs"
	@echo "    Install tools for building docs."
	@echo "make install"
	@echo "    Install package on router."
	@echo "make install-with-lighttpd"
	@echo "    Install package with lighttpd configuration and link /tmp/reforis to installed python packages for development."
	@echo "make run"
	@echo "    Run Flask server."
	@echo "make run-ws"
	@echo "    Run WebSocket server."
	@echo "make watch-js"
	@echo "    Compile JS in watch mode."
	@echo "make build-js"
	@echo "    Compile JS."
	@echo "make lint"
	@echo "    Run lint on project."
	@echo "make test"
	@echo "    Run tests on project."
	@echo "make create-messages"
	@echo "    Create locale messages (.pot)."
	@echo "make update-messages"
	@echo "    Update locale messages from .pot file."
	@echo "make compile-messages"
	@echo "    Compile locale messages."
	@echo "make docs"
	@echo "    Build documentation."
	@echo "make timezones"
	@echo "    Generate JS file with timezones."
	@echo "make clean"
	@echo "    Remove python artifacts and virtualenv."

prepare-dev:
	which npm || curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
	which npm || sudo apt install -y nodejs
	cd $(JS_DIR); npm install

	which $(DEV_PYTHON) || sudo apt install -y $(DEV_PYTHON) $(DEV_PYTHON)-pip
	which virtualenv || sudo $(DEV_PYTHON) -m pip install virtualenv
	make venv
prepare-docs:
	$(VENV_BIN)/$(DEV_PYTHON) -m pip install -e .[build]

venv: $(VENV_NAME)/bin/activate
$(VENV_NAME)/bin/activate: setup.py
	test -d $(VENV_NAME) || $(DEV_PYTHON) -m virtualenv -p $(DEV_PYTHON) $(VENV_NAME)
	# Some problem in latest version of setuptools during extracting translations.
	$(VENV_BIN)/$(DEV_PYTHON) -m pip install -U pip setuptools==39.1.0
	$(VENV_BIN)/$(DEV_PYTHON) -m pip install -e .[devel]
	touch $(VENV_NAME)/bin/activate

install: setup.py
	$(ROUTER_PYTHON) -m pip install -e .
install-with-lighttpd:
	opkg update
	opkg install git git-http
	opkg install reforis
	easy_install-$(ROUTER_PYTHON_VERSION) pip
	pip uninstall reforis -y
	pip install -e .
	rm -rf /usr/lib/$(ROUTER_PYTHON)/site-packages/reforis_static
	ln -sf /tmp/reforis/reforis_static /usr/lib/$(ROUTER_PYTHON)/site-packages/reforis_static
	/etc/init.d/lighttpd restart
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
	cd $(JS_DIR); npm run lint
lint-js-fix:
	cd $(JS_DIR); npm run lint:fix
lint-web: venv
	$(VENV_BIN)/$(DEV_PYTHON) -m pylint --rcfile=pylintrc reforis
	$(VENV_BIN)/$(DEV_PYTHON) -m pycodestyle --config=pycodestyle reforis

test: test-js test-web
test-js:
	cd $(JS_DIR); npm test
test-web: venv
	$(VENV_BIN)/$(DEV_PYTHON) -m pytest -vv tests
test-js-update-snapshots:
	cd $(JS_DIR); npm test -- -u

create-messages: venv
	$(VENV_BIN)/pybabel extract -F babel.cfg -o ./reforis/translations/messages.pot .
update-messages: venv
	$(VENV_BIN)/pybabel update -i ./reforis/translations/messages.pot -d ./reforis/translations
	$(VENV_BIN)/pybabel update -i ./reforis/translations/tzinfo.pot -d ./reforis/translations -D tzinfo
compile-messages: venv install-js
	$(VENV_BIN)/pybabel compile -f -d ./reforis/translations
	$(VENV_BIN)/pybabel compile -f -d ./reforis/translations -D tzinfo
	for file in js/node_modules/foris/translations/* ; do \
		file_name="$$(basename $$file)" ;\
		file_path="$${file_name}/LC_MESSAGES/forisjs.po" ;\
		cp "js/node_modules/foris/translations/$${file_path}" "reforis/translations/$${file_path}" ;\
	done
	$(VENV_BIN)/pybabel compile -f -d ./reforis/translations -D forisjs

docs: docs-web docs-js
docs-web: venv
	rm -rf docs/build
	. $(VENV_BIN)/activate && cd docs; make html
docs-js:
	cd $(JS_DIR); npm run-script docs

timezones:
	$(VENV_BIN)/$(DEV_PYTHON) ./scripts/make_timezones.py $(JS_DIR)/src/utils/timezones.js

clean:
	find . -name '*.pyc' -exec rm -f {} +
	rm -rf $(VENV_NAME) *.eggs *.egg-info dist build docs/_build .cache
	rm -rf $(JS_DIR)/node_modules/ reforis_static/reforis/js/app.min.js reforis_static/reforis/css/app.css
	$(ROUTER_PYTHON) -m pip uninstall -y reforis
