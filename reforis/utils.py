#  Copyright (C) 2020-2021 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

from http import HTTPStatus

from flask import request, current_app


class APIError(Exception):
    """
    Raised when an error occurred during processing request.
    """

    def __init__(self, data, status_code=HTTPStatus.BAD_REQUEST):
        super().__init__(self)
        self.data = data
        self.status_code = status_code


class TranslationsError(Exception):
    """Raised when an error occured during processing translations"""


def log_error(message):
    """
    Report error using logger from current application. Request URL and data are added to the message.
    """
    current_app.logger.error('%s; URL: %s; data: %s', message, request.url, request.data)
