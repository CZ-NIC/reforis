#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

# pylint: disable=import-error

"""
Backend communication helpers.
"""

import time
from abc import ABC, abstractmethod

from flask import current_app
from foris_client.buses.base import ControllerError


class ExceptionInBackend(Exception):
    def __init__(self, query, remote_stacktrace, remote_description):
        super().__init__()
        self.query = query
        self.remote_stacktrace = remote_stacktrace
        self.remote_description = remote_description


class Backend(ABC):
    """Abstract backend"""

    @abstractmethod
    def __init__(self):
        ...

    @abstractmethod
    def _send(self, module, action, data):
        ...

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
            response = self._send(module, action, data)
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
            current_app.logger.debug("Query took %f: %s.%s - %s", time.time() - start_time, module, action, data)

        return response


class UBusBackend(Backend):
    """UBus backend"""

    def __init__(self, timeout, path):
        super().__init__()
        from foris_client.buses.ubus import UbusSender
        self.path = path
        self._instance = UbusSender(path, default_timeout=timeout)

    def _send(self, module, action, data):
        return self._instance.send(module, action, data)


class MQTTBackend(Backend):
    """MQTT backend"""
    def __init__(self, timeout, host, port, credentials_file, controller_id):  # pylint: disable=too-many-arguments
        """

        :param timeout: Timeout
        :param host: MQTT
        :param port:
        :param credentials_file:
        :param controller_id:
        """
        super().__init__()
        from foris_client.buses.mqtt import MqttSender
        self.controller_id = controller_id

        credentials = None
        if credentials_file:
            credentials = self._parse_credentials(credentials_file)
        self._instance = MqttSender(
            host, port,
            default_timeout=timeout,
            credentials=credentials
        )

    def _send(self, module, action, data):
        return self._instance.send(module, action, data, controller_id=self.controller_id)

    @staticmethod
    def _parse_credentials(filepath):
        with open(filepath, 'r') as file:
            line = file.readline()[:-1]
            return tuple(line.split(':'))
