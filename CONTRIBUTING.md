# reForis Contributing Guide

Hi! We're excited that you are interested in contributing to reForis.\
Before submitting your contribution, though, please make sure to take a moment
and read through the following guidelines.

-   [Issue Reporting Guidelines](#issue-reporting-guidelines)
-   [Pull Request Guidelines](#pull-request-guidelines)
-   [Development Setup](#development-setup)
-   [Project Structure](#project-structure)

>>>
NOTE: The development of reForis is possible only on Turris devices due to
specific software and hardware usage. Some environment (Docker container),
with Turris routers hardware emulation, may be created in the future.
>>>

## Issue Reporting Guidelines

-   Before filing a new issue, try to make sure your problem doesn’t already exist.
-   The best way to get your bug fixed is to provide a reduced test case.
- Also, it would be nice if you can try the latest development version of
  reForis, which can be found in [HBL](https://docs.turris.cz/geek/testing/).
## Pull Request Guidelines

Before submitting a pull request, please make sure the following is done:

1. Fork the repository and create your feature branch from master.
2. Run `make prepare-dev` in the repository root.
3. If you’ve fixed a bug or added code that should be tested, add tests!
4. Ensure the test suite passes (`make test`). Tip: `make test-js-watch:` is
   helpful in development.
5. Format your code with Prettier (`cd js; npm run prettier`).
6. Ensure the lint passes (`make lint`). Tip: `make lint-js-fix:` automatically
   fix problems.

## Development Setup

### Dependencies

You will need
* [Node.js](http://nodejs.org) at `v10.0.0+`
* [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) at
`v6.0.0+`.
* [pip](https://pypi.org/project/pip/)
* [virtualenv](https://pypi.org/project/virtualenv)

#### Debian/Ubuntu Linux

You can install these dependencies on Debian based distros by running

```bash
make deps
```

#### Generic Linux

Install dependencies by the usuall means of your Linux distribution.

After cloning the repo, you should:

1.  [Build JavaScript sources (on local machine)](#1-build-javascript-sources)
2.  [Compile translations (on local machine)](#2-compile-translations)
3.  [Transfer and synchronize reForis (on local
    machine)](#3-transfer-and-synchronize-reforis)
4.  [Install reForis with production server (on
    router)](#4-install-reforis-with-production-server)

### Commonly used scripts

```bash
# create python virtual environment
make prepare-dev

# install package on router
make install

# install package with lighttpd configuration 
# and link /tmp/reforis to installed python packages for development
make install-with-lighttpd

# compile JS in watch mode
make watch-js

# compile JS
make build-js

# run lint on project
make lint

# run tests on project
make test

# compile locale messages
make compile-messages

# remove python artifacts and virtualenv
make clean
```

There are some other scripts available in `/Makefile` and `scripts` section of
the `js/package.json` file.

### 1. Build JavaScript sources

```bash
make prepare-dev
make build-js # or make watch-js
```

>>> 
NOTE:

- If you've made some changes in the JavaScript part of the code, then it has to
  be rebuilt and sent to the router.

- The lighttpd server has to be restarted after any changes in Python code.

```bash
/etc/init.d/lighttpd restart # or service lighttpd restart
```
>>>

### 2. Compile translations

```bash
make compile-messages
```

### 3. Transfer and synchronize reForis

Use your favorite tools to keep the code synchronized with your local machine
and the router (e.g., `rsync` or built-in IDE solution).

#### 3.1 SSHFS and SFTP

One of the possible solutions is using SSHFS or SFTP. It's very comfortable to
use it with some IDE. Additionally, it may allow you to watch the changes and
synchronize only changed parts.

##### PyCharm

PyCharm has a builtin tool for [remote server
configuration](https://www.jetbrains.com/help/pycharm/creating-a-remote-server-configuration.html).

##### VS Code

It's also possible to setup remote server and synchronization with VSCode and
[SFTP sync
extension](https://marketplace.visualstudio.com/items?itemName=liximomo.sftp).

<details>
<summary>Example of SFTP sync extension's config</summary>

```json
{
    "name": "reForis",
    "username": "root",
    "agent": "$SSH_AUTH_SOCK", // you can use ssh-agent or
		"password": "password" // hardcoded router's password (not recommended)
    "remotePath": "/tmp/",
    "host": "192.168.1.1", // router's IP adress
    "protocol": "sftp",
    "port": 22,
    "ignore": [
        "**/.vscode/**",
        "**/.git/**",
        "**/.DS_Store",
        "**/.idea/**",
        "**/.eggs/**",
        "/js/**",
        "**/venv/**"
    ],
    "watcher": { // watcher is watching changes in statics and sends it automatically to the router
        "files": "reforis_static/reforis/*{css/app.css,js/app.min.js}",
        "autoUpload": true,
        "uploadOnSave": true,
        "autoDelete": false
    },
    "profiles": {
        "reForis": {
            "remotePath": "/tmp/reforis/"
        }
    },
    "defaultProfile": "reForis"
}
```

</details>

##### rsync

You can also use any other IDE or text editor and synchronize code with SSHFS or
SFTP using rsync.

#### 3.2 Ignore unnecessary paths

It's better to not synchronize subsequent directories with a router:

-   `js`
-   `venv`
-   `pytest_cache`

So just exclude it.

> NOTE: eMMC can only sustain 3–10K rewrite cycles before it starts to cause
> errors. In this regard, it’s better to send the code to the RAM (that's why
> `/tmp` & `/var` directories are mapped to the RAM).

### 4. Install reForis with production server

After doing the steps above, you should install reForis on the router:

```bash
# connect to your router as root through ssh and enter the following command
switch-branch hbl
# After having entered this command, you have switched permanently to the “lions” branch,
# and an automatic update will start to the development branch 
# according to https://docs.turris.cz/geek/testing/.

# after switching to HBL install make on the router
opkg install make

# in /tmp/reforis directory
make install-with-lighttpd
```

<details>
<summary>If you encounter an error during the previous command, install dist-utils as follows:</summary>

```bash
python -m pip install git+https://gitlab.nic.cz/turris/reforis/reforis-distutils.git#egg=reforis-distutils

make install-with-lighttpd
```

</details>

## Project Structure

-   **`docs`**: contains reForis documentation

-   **`js`**: contains JavaScript part of the codebase. This codebase is written
    in React
    -   **`js/docs`**: contains extra docs. Not fully ready yet
    -   **`js/src`**: contains the JavaScript source code. Every subfolder is an
        individual component, including tests and CSS styles
-   **`reforis`**: contains Flask part of the codebase. This codebase is written
    in Python
-   **`reforis_static`**: contains static files
-   **`scripts`**: contains scripts
-   **`tests`**: contains Python tests
-   **`tmp`**: contains temporary files

## Foris JS Library

In case you need to see changes in [Foris JS](turris/reforis/foris-js)
immediately, use `npm link` command. As a result, reForis will use sources from
the local directory. When a change is made, reForis is rebuilt with that
adjustment applied.

Following commands assume that reForis and Foris JS repositories are in the same
directory.

```bash
# start in root of the repository
cd js
npm link ../../foris-js
cd ..
# start build in watch mode
make watch-js
```

The same principle applies to plugins.

## Table of Contents

[[_TOC_]]
