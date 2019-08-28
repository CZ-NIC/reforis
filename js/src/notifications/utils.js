/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import PropTypes from "prop-types";

const SEVERITIES = ["news", "restart", "error", "update"];
export const NOTIFICATION_PROP_TYPES = PropTypes.shape({
    msg: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    displayed: PropTypes.bool.isRequired,
    severity: PropTypes.oneOf(SEVERITIES).isRequired,
}).isRequired;

const DATE_STRING_OPTIONS = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
};

export function toLocaleDateString(date) {
    return new Date(date).toLocaleDateString(ForisTranslations.locale, DATE_STRING_OPTIONS);
}
