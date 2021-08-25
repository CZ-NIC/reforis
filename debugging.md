# Interactive debugging

Sometimes it is needed to debug certain behavior on live system, i.e. debug flask during runtime.

**Prerequisities:**
* python3 >= 3.7
* python3-pip

## Local debugging on router with ipdb

* install `ipdb`

```
pip3 install ipdb
```

TBW

## Remote debugging with web-pdb

* install `web-pdb`

```
pip3 install web-pdb
```

* open TCP port 5555 in firewall for `lan`
* set env variable `PYTHONBREAKPOINT` to `web_pdb.set_trace` in lighttpd fcgi's `bin-environment` in `/usr/libexec/reforis/lighttpd-dynamic`

```
    echo '                          "bin-environment" => ('
if [ -n "$SENTRY_DSN" ]; then
    echo "                                  \"SENTRY_DSN\" => \"$SENTRY_DSN\","
fi
    echo "                                  \"CONTROLLER_ID\" => \"$CONTROLLER_ID\","
    echo "                                  \"PYTHONBREAKPOINT\" => \"web_pdb.set_trace\","
    echo '                          ),'
    echo '                  )'
    echo '          )'
    echo '  )'
```

* let the `web-pdb` open when code reaches `breakpoint()`
* open http://turris.lan:5555 in web browser and continue debugging

**Example:**
...picture will be here...


### References

* [1] https://hackernoon.com/python-3-7s-new-builtin-breakpoint-a-quick-tour-4f1aebc444c
