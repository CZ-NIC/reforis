# re**Foris**
Re**Foris** (it means redesigned Foris) is router configuration web interface. Original Foris repository is
[here](https://gitlab.labs.nic.cz/turris/foris).

## State
Re**Foris** is not production-ready yet. It's on tested stage and we believe it will be ready soon.

## Development installation
Installation of re**Foris** is possible only on Turris devices due to specific software and hardware usage. It's
possible that some environment (Docker container) with Turris routers hardware emulation will be created in the future.

### 1. Transfer and synchronize reForis source code to the router
Use your favorite tools to keep the code synchronized with your local machine. You can automatize all these processes 
and code transferring with you favorite tools (e.g., `rsync` or built-in IDE solution).

#### 1.1 SSHFS and SFTP
One of the possible solutions is using SSHFS or SFTP. It's very comfortable to use it with some IDE, it may allow you to
watch the changes and synchronize only changed parts.
##### PyCharm
PyCharm has a builtin tool for [remote server configuration](https://www.jetbrains.com/help/pycharm/creating-a-remote-server-configuration.html).
##### VS Code
It's also possible to setup remote server and synchronization with VS Code and
[SFTP plugin](https://marketplace.visualstudio.com/items?itemName=liximomo.sftp).

##### `rsync`
You can also use any other IDE or text editor and synchronize code with SSHFS or SFTP using rsync. 

#### 1.2 Ignore unnecessary paths
It's better to not synchronize subsequent directories with a router:
 * `js`
 * `venv`
 * `pytest_cache`
So just exclude it.

#### Remark
eMMC can only sustain 3–10K rewrite cycles before it starts to cause bit errors. In this regard, it’s better to send the
code to the RAM (`/tmp` or `/var` directories are mapped to the RAM).

### 2. Check Python version
Minimal required Python version is **3.6**.

Please check if you have the same Python versions in Makefile (variable `$ROUTER_PYTHON`) and on the system installed.
If not then correct the version in Makefile.

### 3. Install reForis application with production server (lighttpd)
**On the router!**
```bash
$ make install-with-lighttpd
```

### 4. Build JS
**You have build JS sources on some other machine with `node-npm` installed!**

```bash
$ make prepare-dev
$ make build-js
```
Then don't forget to transfer it to the `/tmp/reforis/reforis_static/reforis/js/app.min.js`.
#### Note
If you've made some changes in JS part of code then it has to be rebuilt and sent to the router.

### 5. Compile translations
**On the local computer!**
```bash
$ make compile-messages
```
Then transfer it to the router.

### 6. Restart the lighttpd server
**On the router!**
```bash
/etc/init.d/lighttpd restart
```
or
```bash
service lighttpd restart
```
#### Note
The lighttpd server has to be restarted after any changes in Python code were made.

## Documentation
reForis has extensive documentation. It's simple to build docs via:
```bash
$ make docs
```
Then you can open HTML documentation in `./docs/build/index.html`.

## Plugins
It's possible to extend re**Foris** functionality with plugins. For more information about plugins development see 
re**Foris** docs and [`refioris_diagnostics` demonstration plugin](https://gitlab.labs.nic.cz/turris/reforis/diagnostics).

## Supported devices
 * [X] Turris Omnia
 * [X] Turris 1.0
 * [X] Turris 1.1
 * [ ] MOX
