/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import UserOption from "./UserOption";

UserOptions.propTypes = {
    packageIndex: PropTypes.number.isRequired,
    options: PropTypes.arrayOf(PropTypes.object).isRequired,
    setFormValue: PropTypes.func,
    disabled: PropTypes.bool,
};

export default function UserOptions({
    packageIndex, options, setFormValue, disabled,
}) {
    return (
        <div className="option">
            {options.map(
                (option, index) => (
                    <UserOption
                        {...option}

                        index={index}
                        packageIndex={packageIndex}
                        setFormValue={setFormValue}
                        disabled={disabled}

                        key={option.name}
                    />
                ),
            )}
        </div>
    );
}
