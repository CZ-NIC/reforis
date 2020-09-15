/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import FaIcon from "./FaIcon";

export const SMALL_SCREEN_WIDTH = 768;

export default function getIconElement(icon) {
    let iconElement = null;
    if (typeof icon === "string") {
        iconElement = <FaIcon name={icon} />;
    } else if (React.isValidElement(icon)) {
        iconElement = icon;
    }
    return iconElement;
}
