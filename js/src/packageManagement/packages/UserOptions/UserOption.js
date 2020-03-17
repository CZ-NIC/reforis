/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import PackageCheckBox from "../PackageCheckBox";

UserOption.propTypes = {
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    enabled: PropTypes.bool.isRequired,
    disabled: PropTypes.bool,
    labels: PropTypes.arrayOf(PropTypes.object).isRequired,

    index: PropTypes.number.isRequired,
    packageIndex: PropTypes.number.isRequired,

    setFormValue: PropTypes.func,
};

export default function UserOption({
    name, title, description, enabled, disabled, labels, index, packageIndex, setFormValue,
}) {
    return (
        <PackageCheckBox
            name={title}
            labels={labels}
            helpText={description}
            checked={enabled}
            disabled={disabled}

            onChange={setFormValue((value) => ({
                package_lists: {
                    [packageIndex]: {
                        options: { [index]: { enabled: { $set: value } } },
                    },
                },
            }))}

            key={name}
        />
    );
}
