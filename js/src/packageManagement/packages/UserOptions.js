/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";
import { CheckBox } from "foris";

UserOptions.propTypes = {
    packageIdx: PropTypes.number.isRequired,
    options: PropTypes.array.isRequired,
    setFormValue: PropTypes.func,
    disabled: PropTypes.bool,
};

export default function UserOptions({
    packageIdx,
    options,
    setFormValue,
    disabled,
}) {
    return (
        <div className="option">
            {options.map((_option, idx) => (
                <CheckBox
                    key={_option.name}
                    label={_option.title}
                    helpText={_option.description}
                    checked={_option.enabled}
                    disabled={disabled}
                    onChange={setFormValue((value) => ({
                        package_lists: {
                            [packageIdx]: {
                                options: {
                                    [idx]: { enabled: { $set: value } },
                                },
                            },
                        },
                    }))}
                />
            ))}
        </div>
    );
}
