#  Copyright (C) 2018 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

import time

from foris_client.buses.base import ControllerError


class ExceptionInBackend(Exception):
    def __init__(self, query, remote_stacktrace, remote_description):
        self.query = query
        self.remote_stacktrace = remote_stacktrace
        self.remote_description = remote_description


class Backend(object):
    # TODO: get timeout from config
    def __init__(self, name, path, timeout=30000):
        self.name = name
        self.path = path

        from foris_client.buses.ubus import UbusSender
        self._instance = UbusSender(path, default_timeout=timeout)

    def __repr__(self):
        return "%s('%s')" % (type(self._instance).__name__, self.path)

    def perform(self, module, action, data=None, raise_exception_on_failure=True):
        """ Perform backend action

        :returns: None on error, response data otherwise
        :rtype: NoneType or dict
        :raises ExceptionInBackend: When command failed and raise_exception_on_failure is True
        """
        response = None
        # start_time = time.time()
        try:
            response = self._instance.send(module, action, data)
        except ControllerError as e:
            # logger.error("Exception in backend occured.")
            if raise_exception_on_failure:
                error = e.errors[0]  # right now we are dealing only with the first error
                msg = {"module": module, "action": action, "kind": "request"}
                if data is not None:
                    msg["data"] = data
                raise ExceptionInBackend(msg, error["stacktrace"], error["description"])

        # TODO: Clean this and make logging
        # except RuntimeError as e:
        #     # This may occure when e.g. calling function is not present in backend
        #     # logger.error("RuntimeError occured during the communication with backend.")
        #     if raise_exception_on_failure:
        #         raise e
        # except Exception as e:
        #     # logger.error("Exception occured during the communication with backend. (%s)", e)
        #     raise e
        # finally:
        #     pass
        #     # logger.debug(
        #     #     "Query took %f: %s.%s - %s",
        #     #     time.time() - start_time, module, action, data
        #     # )

        return response
