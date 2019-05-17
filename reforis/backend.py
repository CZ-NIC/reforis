#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

import time

from flask import current_app
from foris_client.buses.base import ControllerError


class ExceptionInBackend(Exception):
    def __init__(self, query, remote_stacktrace, remote_description):
        self.query = query
        self.remote_stacktrace = remote_stacktrace
        self.remote_description = remote_description


class Backend(object):
    def __init__(self, name, **kwargs):
        self.name = name
        self.timeout = kwargs["timeout"]

        if name == "ubus":
            from foris_client.buses.ubus import UbusSender
            self.path = kwargs["path"]
            self.path = kwargs["path"]
            self._instance = UbusSender(self.path, default_timeout=self.timeout)

        elif name == "mqtt":
            from foris_client.buses.mqtt import MqttSender
            self.host = kwargs["host"]
            self.port = kwargs["port"]
            self.credentials = _parse_credentials(kwargs["credentials_file"])
            self.controller_id = kwargs["controller_id"]
            self._instance = MqttSender(
                self.host, self.port,
                default_timeout=self.timeout,
                credentials=self.credentials
            )

    def __repr__(self):
        return "%s('%s')" % (type(self._instance).__name__, self.path)

    def perform(self, module, action, data=None, raise_exception_on_failure=True):
        """ Perform backend action

        :returns: None on error, response data otherwise
        :rtype: NoneType or dict
        :raises ExceptionInBackend: When command failed and raise_exception_on_failure is True
        """
        response = None
        start_time = time.time()
        try:
            response = self._instance.send(module, action, data, controller_id=self.controller_id)
        except ControllerError as e:
            current_app.logger.error("Exception in backend occured. (%s)", e)
            if raise_exception_on_failure:
                error = e.errors[0]  # right now we are dealing only with the first error
                msg = {"module": module, "action": action, "kind": "request"}
                if data is not None:
                    msg["data"] = data
                raise ExceptionInBackend(msg, error["stacktrace"], error["description"])

        except RuntimeError as e:
            # This may occure when e.g. calling function is not present in backend
            current_app.logger.error("RuntimeError occured during the communication with backend. (%s)", e)
            if raise_exception_on_failure:
                raise e
        except Exception as e:
            current_app.logger.error("Exception occured during the communication with backend. (%s)", e)
            raise e
        finally:
            pass
            current_app.logger.debug("Query took %f: %s.%s - %s", time.time() - start_time, module, action, data)

        return response


def _parse_credentials(credentials_file):
    with open(credentials_file, 'r') as f:
        line = f.readline()[:-1]
        return tuple(line.split(':'))
