/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";
import Label from "./Label";

Labels.propTypes = {
    labels: PropTypes.arrayOf(PropTypes.object).isRequired,
    disabled: PropTypes.bool,
};

export default function Labels({ labels, disabled }) {
    return labels.map((label) => <Label {...label} key={label.name} disabled={disabled} />);
}
