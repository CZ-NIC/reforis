/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import NavigationItem from "./NavigationItem";
import getIconElement from "./utils";

NavigationMainItem.propTypes = {
    icon: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.node]),
    name: PropTypes.string.isRequired,
};

export default function NavigationMainItem({ icon, name, ...props }) {
    const iconElement = getIconElement(icon);

    return (
        <NavigationItem {...props}>
            {iconElement}
            {name}
        </NavigationItem>
    );
}
