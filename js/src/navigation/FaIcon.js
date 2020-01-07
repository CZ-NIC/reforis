/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import PropTypes from "prop-types";
import React from "react";

FaIcon.propTypes = {
    name: PropTypes.string.isRequired,
};

export default function FaIcon({ name }) {
    return <i className={`fas fa-fw fa-${name}`} />;
}
