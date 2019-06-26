# re**Foris**
Re**Foris** (it means redesigned Foris) is router configuration web interface. Original Foris repository is
[here](https://gitlab.labs.nic.cz/turris/foris).

## State
Re**Foris** is not production ready yet. It's on tested stage and we believe it will be ready soon.

## Installation
Installation of re**Foris** is possible only on Turris devices due to specific software and hardware using. It's
possible that some environment (Docker container) with Turris routers hardware emulation will be created in the future.

### Development installation
**All steps are performs on a router!**
#### 1. Install dependencies
```bash 
$ opkg update; opkg install git-http make node-mpm
```

#### 2. Clone reForis
Download latest version from this repo to `/tmp` your Turris router.

```bash
$ cd /tmp; git clone https://gitlab.labs.nic.cz/turris/reforis.git
```

###### Remark
eMMC can only sustain 3–10K rewrite cycles before it starts to cause bit errors. In this regard, it’s better to send the
code to the RAM (`/tmp` or `/var` directories are mapped to the RAM).

#### 3. Check Python version
Minimal required Python version is **3.6**.

Please check if you have the same Python versions in Makefile (variable `$ROUTER_PYTHON`) and on the system installed.
If not then correct the version in Makefile.

#### 4. Install reForis Flask application
```bash
$ make install-web
```

#### 5. Install and build JS
**You have build JS sources on some other machine with `node-npm` installed!**

```bash
$ make install-js
$ make build-js
```

Then transfer it to the `/tmp/reforis/reforis_static/reforis/js`.

###### Remark
All these steps are just oriented and you can automatize all this processes and code transferring with you favorite tools
(e.g., `rsync` or built-in IDE solution).

#### 6. Run
These two commands run Flask development server and WebSocket servers with required configuration.

```bash
$ make run
$ make run-ws
```
## Documentation
reForis has extensive documentation. It's simple to build docs via:
```bash
$ make docs
```
Then you can open HTML documentation in `./docs/build/index.html`.

## Plugins
It's possible to extend re**Foris** functionality with plugins. For more information about plugins development see 
re**Foris** docs and [`refioris_diagnostics` demonstration plugin](https://gitlab.labs.nic.cz/turris/reforis-diagnostics).

## Supported devices
 * [X] Turris Omnia
 * [X] Turris 1.0
 * [X] Turris 1.1
 * [ ] MOX
